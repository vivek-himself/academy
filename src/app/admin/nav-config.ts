import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  Users,
  UserCircle,
  Layers,
  ShoppingCart,
  Award,
  Database,
  Star,
  Trophy,
  Briefcase,
  Mail,
  Activity,
  BarChart3,
  FileBarChart,
  Heart,
  Globe,
  Bell,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  stub?: boolean;
};

export type NavSection = {
  heading?: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    items: [{ label: "Overview Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    heading: "Learning Management",
    items: [
      { label: "Courses & Programs", href: "/admin/courses", icon: BookOpen },
      { label: "Course Categories", href: "/admin/categories", icon: Tag },
      { label: "Mentors & Instructors", href: "/admin/mentors", icon: UserCircle },
      { label: "Batches & Classes", href: "/admin/batches", icon: Layers },
      { label: "Users & Students", href: "/admin/students", icon: Users },
      { label: "Payments & Orders", href: "/admin/payments", icon: ShoppingCart, stub: true },
      { label: "Certificates", href: "/admin/certificates", icon: Award, stub: true },
    ],
  },
  {
    heading: "Platform Content",
    items: [
      { label: "Knowledge Base", href: "/admin/knowledge-base", icon: Database },
      { label: "FAQ Management", href: "/admin/faqs", icon: Star },
      { label: "Student Success Stories", href: "/admin/testimonials", icon: Trophy },
      { label: "Contact Submissions", href: "/admin/contact-submissions", icon: Mail },
      { label: "Career Opportunities", href: "/admin/careers", icon: Briefcase, stub: true },
      { label: "Email Automation", href: "/admin/email-automation", icon: Mail, stub: true },
      { label: "Email Activity", href: "/admin/email-activity", icon: Activity, stub: true },
    ],
  },
  {
    heading: "Communication",
    items: [{ label: "Notifications", href: "/admin/notifications", icon: Bell }],
  },
  {
    heading: "Insights & Reporting",
    items: [
      { label: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, stub: true },
      { label: "Reports & Exports", href: "/admin/reports", icon: FileBarChart, stub: true },
    ],
  },
  {
    heading: "Website Management",
    items: [
      { label: "Homepage Content", href: "/admin/homepage", icon: Globe },
      { label: "Growth Program Pages", href: "/admin/growth", icon: Briefcase },
      { label: "Pricing Plans", href: "/admin/pricing", icon: Tag },
      { label: "Footer Management", href: "/admin/footer", icon: Heart },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    items: [{ label: "Platform Settings", href: "/admin/settings", icon: Settings }],
  },
];
