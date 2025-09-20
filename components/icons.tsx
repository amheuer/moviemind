import type { SVGProps } from "react";

const Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="currentColor" />
    </svg>
);

export const Star = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Terminal = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Brain = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const ChevronRight = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Code = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Cpu = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Activity = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Zap = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
export const Database = (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;

export default Icon;
