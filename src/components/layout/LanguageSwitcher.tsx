import { useI18n, type Locale } from "~/i18n";
import SegmentedControl, { type SegmentedControlOption } from "../ui/SegmentedControl";

interface LanguageSwitcherProps {
    variant?: "compact" | "full";
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
    const { locale, setLocale } = useI18n();

    const options: SegmentedControlOption<Locale>[] = [
        { value: "en", label: "EN" },
        { value: "bn", label: "BN" }
    ];

    const fullOptions: SegmentedControlOption<Locale>[] = [
        { value: "en", label: "English" },
        { value: "bn", label: "বাংলা" }
    ];

    return (
        <div class="w-auto shrink-0">
            <SegmentedControl<Locale>
                options={props.variant === "full" ? fullOptions : options}
                value={locale()}
                onChange={(val) => setLocale(val)}
                size={props.variant === "compact" ? "sm" : "md"}
                fullWidth={false}
            />
        </div>
    );
}
