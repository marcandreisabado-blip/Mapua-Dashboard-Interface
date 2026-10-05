import { useState, type FormEvent } from "react";
import { ArrowRight, ClipboardList, ShieldCheck } from "lucide-react";
import {
  getGetFoundItemStatsQueryKey,
  getListFoundItemsQueryKey,
  useCreateFoundItem,
  type FoundItemInputCategory,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const categories: FoundItemInputCategory[] = [
  "Electronics",
  "Personal items",
  "School supplies",
  "Clothing & accessories",
  "Keys & cards",
  "Other",
];

function localToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ReportItemPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const queryClient = useQueryClient();
  const mutation = useCreateFoundItem();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoundItemInputCategory | "">("");
  const [publicDescription, setPublicDescription] = useState("");
  const [location, setLocation] = useState("");
  const [foundAt, setFoundAt] = useState(localToday);
  const [publicConfirmation, setPublicConfirmation] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category || !publicConfirmation) return;

    mutation.mutate(
      { data: { name: name.trim(), category, publicDescription: publicDescription.trim(), location: location.trim(), foundAt } },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getListFoundItemsQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getGetFoundItemStatsQueryKey() }),
          ]);
          onNavigate("/");
        },
      },
    );
  }

  return (
    <div className="report-page">
      <div className="page-topline">
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Report Item</b></div>
        <span className="sample-tag"><span /> SAVE A LISTING</span>
      </div>
      <div className="report-header">
        <div className="placeholder-icon"><ClipboardList size={25} /></div>
        <div><p className="section-kicker">MAPÚA FINDR</p><h1>Report a found item</h1><p>Share enough detail for its owner to recognize it, without exposing private information.</p></div>
      </div>
      <div className="public-report-notice">
        <ShieldCheck size={18} />
        <span>Reports are visible to visitors. Do not include names, contact details, student IDs, serial numbers, or private verification clues.</span>
      </div>
      <form className="report-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Item name <b>*</b></span>
            <input className="field-control" required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Black wireless earbuds" autoComplete="off" />
          </label>
          <label className="form-field">
            <span>Category <b>*</b></span>
            <select className="field-control" required value={category} onChange={(event) => setCategory(event.target.value as FoundItemInputCategory | "")}>
              <option value="" disabled>Select a category</option>
              {categories.map((itemCategory) => <option key={itemCategory} value={itemCategory}>{itemCategory}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Where was it found? <b>*</b></span>
            <input className="field-control" required minLength={2} maxLength={160} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Building, room, or campus landmark" autoComplete="off" />
          </label>
          <label className="form-field">
            <span>Date found <b>*</b></span>
            <input className="field-control" type="date" required value={foundAt} onChange={(event) => setFoundAt(event.target.value)} />
          </label>
          <label className="form-field form-field-wide">
            <span>Public description <b>*</b></span>
            <textarea className="field-control field-textarea" required minLength={3} maxLength={500} value={publicDescription} onChange={(event) => setPublicDescription(event.target.value)} placeholder="Describe the item generally; save unique identifying details for private verification." rows={4} />
            <small>{publicDescription.length}/500 characters</small>
          </label>
        </div>
        <label className="public-confirmation">
          <input type="checkbox" required checked={publicConfirmation} onChange={(event) => setPublicConfirmation(event.target.checked)} />
          <span>I understand this report is visible to visitors and contains no private contact or verification details.</span>
        </label>
        {mutation.isError && <div className="form-error" role="alert">{mutation.error.message || "The report could not be saved. Please try again."}</div>}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => onNavigate("/")}>Cancel</button>
          <button type="submit" className="primary-button" disabled={mutation.isPending || !category || !publicConfirmation}>
            {mutation.isPending ? "Saving…" : "Save found-item report"} {!mutation.isPending && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
      <p className="report-footer-note">Reports are not linked to a student account yet. Mapúa sign-in and claim verification can be added as a separate step.</p>
    </div>
  );
}
