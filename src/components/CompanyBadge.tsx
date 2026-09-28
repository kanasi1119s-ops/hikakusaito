import { getCompanyBadge } from "../lib/companyBadge";

interface CompanyBadgeProps {
  company: string;
}

export function CompanyBadge({ company }: CompanyBadgeProps) {
  const { initials, color } = getCompanyBadge(company);
  return (
    <span className="company-badge" style={{ backgroundColor: color }} aria-hidden="true">
      {initials}
    </span>
  );
}
