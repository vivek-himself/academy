import PageHeader from "../../../components/PageHeader";
import MentorForm, { type MentorFormValue } from "../MentorForm";

const initial: MentorFormValue = {
  name: "",
  role: "",
  bio: "",
  imageDesktopUrl: "",
  imageMobileUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
};

export default function NewMentorPage() {
  return (
    <div>
      <PageHeader title="Add Mentor" subtitle="Create a new mentor profile" />
      <MentorForm initial={initial} />
    </div>
  );
}
