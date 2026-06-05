"use client";

import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import {
  ChevronRight,
  Info,
  Building,
  Building2,
  FileText,
  Shield,
  MessageSquare,
  Monitor,
  Award,
  Users,
  GraduationCap,
  Landmark,
  GitBranch,
  Crown,
  ScrollText,
  Scale,
  BookOpen,
  Briefcase,
  ArrowLeftRight,
  FileQuestion,
  Globe,
  Banknote,
  Languages,
  BarChart3,
  Microscope,
  FlaskConical,
  Leaf,
  Newspaper,
  Star,
  Presentation,
  ClipboardList,
  Calendar,
  Library,
  Gem,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Info, Building, Building2, FileText, Shield, MessageSquare, Monitor, Award,
  Users, GraduationCap, Landmark, GitBranch, Crown, ScrollText, Scale,
  BookOpen, Briefcase, ArrowLeftRight, FileQuestion, Globe, Banknote,
  Languages, BarChart3, Microscope, FlaskConical, Leaf, Newspaper, Star,
  Presentation, ClipboardList, Calendar, Library, Gem,
};

export interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}

interface NavHubAdminProps {
  title: string;
  subtitle?: string;
  items: NavItem[];
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
  indigo: "bg-indigo-50 text-indigo-600",
  pink: "bg-pink-50 text-pink-600",
  yellow: "bg-yellow-50 text-yellow-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

export default function NavHubAdmin({ title, subtitle, items }: NavHubAdminProps) {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || Info;
            const colorClass = colorClasses[item.color || "blue"] || colorClasses.blue;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="group hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer h-full">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
