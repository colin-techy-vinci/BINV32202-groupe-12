import { useState, type FormEvent } from "react";

interface ApplicationFormProps {
  onSubmit: (message: string) => Promise<boolean>;
}

const ApplicationForm = ({ onSubmit }: ApplicationFormProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    const success = await onSubmit(message);
    setIsSending(false);
    if (success) setSent(true);
  };

  if (sent) return <span className="state state-success">Candidature envoyée</span>;

  return (
    <form onSubmit={submit}>
      <label>
        Message (facultatif)
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>
      <button type="submit" disabled={isSending}>
        {isSending ? "Envoi…" : "Candidater"}
      </button>
    </form>
  );
};

export default ApplicationForm;
