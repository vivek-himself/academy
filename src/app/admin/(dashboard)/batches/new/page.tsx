import PageHeader from "../../../components/PageHeader";
import BatchForm, { type BatchFormValue } from "../BatchForm";

const initial: BatchFormValue = {
  name: "",
  classTimings: "",
  capacity: 0,
  startDate: "",
  endDate: "",
};

export default function NewBatchPage() {
  return (
    <div>
      <PageHeader title="Add Batch" subtitle="Create a new cohort/class" />
      <BatchForm initial={initial} />
    </div>
  );
}
