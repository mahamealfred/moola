'use client';

type Props = {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({ label, onClick, type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-primary text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-600 transition duration-300"
    >
      {label}
    </button>
  );
}
