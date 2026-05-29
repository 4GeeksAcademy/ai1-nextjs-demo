"use client";

import type { MouseEvent } from "react";

type ConfirmDeleteGenreButtonProps = {
  formAction: (formData: FormData) => void | Promise<void>;
  className: string;
};

export default function ConfirmDeleteGenreButton({
  formAction,
  className,
}: ConfirmDeleteGenreButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const confirmed = window.confirm(
      "Delete this genre? This will remove its assignments from books.",
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      formAction={formAction}
      onClick={handleClick}
      className={className}
    >
      Delete Genre
    </button>
  );
}
