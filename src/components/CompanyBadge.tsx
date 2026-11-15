import { getCompanyBadge } from "../lib/companyBadge";
import brandIcons from "../data/brandIcons.json";

interface CompanyBadgeProps {
  company: string;
}

type BrandIcon = { path: string; hex: string; title: string };
const ICONS = brandIcons as Record<string, BrandIcon>;

export function CompanyBadge({ company }: CompanyBadgeProps) {
  const icon = ICONS[company];
  if (icon) {
    return (
      <span className="company-badge company-badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill={icon.hex} focusable="false">
          <path d={icon.path} />
        </svg>
      </span>
    );
  }
  const { initials, color } = getCompanyBadge(company);
  return (
    <span className="company-badge" style={{ backgroundColor: color }} aria-hidden="true">
      {initials}
    </span>
  );
}
