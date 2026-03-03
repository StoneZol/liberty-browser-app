import * as React from "react";
import { cn } from "@/lib/utils";

interface SecureRevealTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
}

const SecureRevealTextarea: React.FC<SecureRevealTextareaProps> = ({ value, className, ...props }) => {
    const [spot, setSpot] = React.useState<{ x: number; y: number } | null>(null);
    const radius = 30;

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpot({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handleMouseLeave = () => {
        setSpot(null);
    };

    const overlayStyle: React.CSSProperties = spot
        ? {
            backgroundImage: `radial-gradient(circle ${radius}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${radius}px, rgba(0,0,0,0.96) ${radius + 1}px)`,
        }
        : {
            backgroundColor: "rgba(0,0,0,0.96)",
        };

    return (
        <div
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <textarea
                value={value}
                className={cn(
                    "min-h-[120px] w-full resize-none rounded-md border bg-muted px-3 py-2 text-sm",
                    className,
                )}
                {...props}
            />
            <div
                className="pointer-events-none absolute inset-0 rounded-md"
                style={overlayStyle}
            />
        </div>
    );
};

export default SecureRevealTextarea;

