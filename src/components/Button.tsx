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
      className="bg-[#13294b] dark:bg-[#ff6600] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#0f213d] dark:hover:bg-[#ff8c00] transition duration-300"
    >
      {label}
    </button>
  );
}
