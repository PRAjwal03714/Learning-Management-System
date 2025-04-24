import ResetTokenClient from '@/components/ResetTokenClient';

type Props = {
  params: {
    token: string;
  };
};

export default function Page({ params }: Props) {
  return <ResetTokenClient token={params.token} />;
}
