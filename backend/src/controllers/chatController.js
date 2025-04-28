const pool = require('../config/db');

// Get all messages in a course's group chat
exports.getCourseMessages = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Get the group chat room for this course
    let roomResult = await pool.query(
      `SELECT id FROM course_chat_rooms 
       WHERE course_id = $1 AND type = 'group'`,
      [courseId]
    );

    let room = roomResult.rows[0];
    
    // If no group chat room exists, create one
    if (!room) {
      roomResult = await pool.query(
        `INSERT INTO course_chat_rooms (course_id, type, name)
         VALUES ($1, 'group', 'Course Group Chat')
         RETURNING id`,
        [courseId]
      );
      room = roomResult.rows[0];
    }

    // Get messages with sender info and status
    const messages = await pool.query(
      `SELECT 
         m.id, m.content, m.sender_id, m.created_at,
         u.name as sender_name,
         u.role as sender_role,
         COALESCE(ms.status, 'delivered') as status,
         CASE 
           WHEN i.profile_picture IS NOT NULL THEN i.profile_picture
           ELSE u.profile_picture
         END as profile_picture
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       LEFT JOIN instructors i ON u.id = i.user_id
       LEFT JOIN message_status ms ON m.id = ms.message_id AND ms.user_id = $1
       WHERE m.room_id = $2
       ORDER BY m.created_at ASC`,
      [userId, room.id]
    );

    res.json({ messages: messages.rows });
  } catch (error) {
    console.error('Error getting course messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages from a private chat
exports.getPrivateMessages = async (req, res) => {
  const { courseId, userId: otherUserId } = req.params;
  const userId = req.user.id;

  try {
    // Get or create private chat room
    let roomResult = await pool.query(
      `SELECT id FROM course_chat_rooms 
       WHERE course_id = $1 AND type = 'private'
       AND id IN (
         SELECT room_id FROM chat_room_members 
         WHERE user_id IN ($2, $3)
         GROUP BY room_id
         HAVING COUNT(*) = 2
       )`,
      [courseId, userId, otherUserId]
    );

    let room = roomResult.rows[0];
    
    // If no private chat room exists, create one
    if (!room) {
      await pool.query('BEGIN');
      
      roomResult = await pool.query(
        `INSERT INTO course_chat_rooms (course_id, type)
         VALUES ($1, 'private')
         RETURNING id`,
        [courseId]
      );
      room = roomResult.rows[0];

      // Add both users to the room
      await pool.query(
        `INSERT INTO chat_room_members (room_id, user_id)
         VALUES ($1, $2), ($1, $3)`,
        [room.id, userId, otherUserId]
      );

      await pool.query('COMMIT');
    }

    // Get messages with sender info and status
    const messages = await pool.query(
      `SELECT 
         m.id, m.content, m.sender_id, m.created_at,
         u.name as sender_name,
         u.role as sender_role,
         COALESCE(ms.status, 'delivered') as status,
         CASE 
           WHEN i.profile_picture IS NOT NULL THEN i.profile_picture
           ELSE u.profile_picture
         END as profile_picture
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       LEFT JOIN instructors i ON u.id = i.user_id
       LEFT JOIN message_status ms ON m.id = ms.message_id AND ms.user_id = $1
       WHERE m.room_id = $2
       ORDER BY m.created_at ASC`,
      [userId, room.id]
    );

    res.json({ messages: messages.rows });
  } catch (error) {
    console.error('Error getting private messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message to course group chat
exports.sendCourseMessage = async (req, res) => {
  const { courseId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // Get the group chat room
    const roomResult = await pool.query(
      `SELECT id FROM course_chat_rooms 
       WHERE course_id = $1 AND type = 'group'`,
      [courseId]
    );

    if (!roomResult.rows[0]) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Insert the message
    const messageResult = await pool.query(
      `INSERT INTO chat_messages (room_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [roomResult.rows[0].id, userId, content]
    );

    res.json({ 
      message: 'Message sent',
      messageId: messageResult.rows[0].id,
      createdAt: messageResult.rows[0].created_at
    });
  } catch (error) {
    console.error('Error sending course message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a private message
exports.sendPrivateMessage = async (req, res) => {
  const { courseId, userId: otherUserId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // Get the private chat room
    const roomResult = await pool.query(
      `SELECT id FROM course_chat_rooms 
       WHERE course_id = $1 AND type = 'private'
       AND id IN (
         SELECT room_id FROM chat_room_members 
         WHERE user_id IN ($2, $3)
         GROUP BY room_id
         HAVING COUNT(*) = 2
       )`,
      [courseId, userId, otherUserId]
    );

    if (!roomResult.rows[0]) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Insert the message
    const messageResult = await pool.query(
      `INSERT INTO chat_messages (room_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [roomResult.rows[0].id, userId, content]
    );

    res.json({ 
      message: 'Message sent',
      messageId: messageResult.rows[0].id,
      createdAt: messageResult.rows[0].created_at
    });
  } catch (error) {
    console.error('Error sending private message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users in a course with their status
exports.getCourseUsers = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Get both students and instructors
    const users = await pool.query(
      `(
        -- Get students
        SELECT 
          u.id, u.name, u.role,
          COALESCE(us.status, 'offline') as status,
          us.last_active,
          u.profile_picture,
            COALESCE(us.is_typing, false) as is_typing
        FROM users u
        JOIN student_courses sc ON u.id = sc.student_id
        LEFT JOIN user_status us ON u.id = us.user_id
        WHERE sc.course_id = $1 AND u.id != $2
      )
      UNION ALL
      (
        -- Get course instructor
        SELECT 
          u.id, u.name, u.role,
          COALESCE(us.status, 'offline') as status,
          us.last_active,
          i.profile_picture
        FROM users u
        JOIN courses c ON c.instructor_id = u.id
        LEFT JOIN instructors i ON u.id = i.user_id
        LEFT JOIN user_status us ON u.id = us.user_id
        WHERE c.id = $1 AND u.id != $2
      )
      ORDER BY role DESC, name ASC`, // Order by role to show instructors first
      [courseId, userId]
    );

    res.json({ users: users.rows });
  } catch (error) {
    console.error('Error getting course users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's online status
exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO user_status (user_id, status, last_active)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET status = $2, last_active = CURRENT_TIMESTAMP`,
      [userId, status]
    );

    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  const { messageIds } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO message_status (message_id, user_id, status)
       SELECT m.id, $1, 'read'
       FROM UNNEST($2::uuid[]) AS ids
       JOIN chat_messages m ON m.id = ids
       ON CONFLICT (message_id, user_id) 
       DO UPDATE SET status = 'read'`,
      [userId, messageIds]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// POST /api/chat/typing
exports.updateTypingStatus = async (req, res) => {
  const { is_typing } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE user_status
       SET is_typing = $1, last_active = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [is_typing, userId]
    );

    res.json({ message: 'Typing status updated' });
  } catch (error) {
    console.error('Error updating typing status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
