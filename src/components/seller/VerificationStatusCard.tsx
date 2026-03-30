import { JSX } from 'solid-js';

export type VerificationStatusType = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

interface VerificationStatusCardProps {
    status: VerificationStatusType;
    rejectionReason?: string | null;
    verifiedAt?: Date | null;
    updatedAt?: Date;
}

function getStatusConfig(status: VerificationStatusType): {
    bg: string;
    border: string;
    text: string;
    icon: JSX.Element;
    title: string;
    description: string;
} {
    switch (status) {
        case 'PENDING':
            return {
                bg: 'bg-cream-100 dark:bg-forest-900',
                border: 'border-forest-300 dark:border-forest-700',
                text: 'text-forest-800 dark:text-forest-200',
                icon: (
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Pending Review',
                description: 'Your verification documents are awaiting admin review.',
            };
        case 'REVIEWING':
            return {
                bg: 'bg-forest-50 dark:bg-forest-900',
                border: 'border-forest-400 dark:border-forest-600',
                text: 'text-forest-800 dark:text-forest-200',
                icon: (
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                ),
                title: 'Under Review',
                description: 'An admin is currently reviewing your verification documents.',
            };
        case 'APPROVED':
            return {
                bg: 'bg-sage-50 dark:bg-sage-900/20',
                border: 'border-sage-300 dark:border-sage-700',
                text: 'text-sage-800 dark:text-sage-200',
                icon: (
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Verified',
                description: 'Your shop has been verified and is now active.',
            };
        case 'REJECTED':
            return {
                bg: 'bg-terracotta-50 dark:bg-terracotta-900/20',
                border: 'border-terracotta-300 dark:border-terracotta-700',
                text: 'text-terracotta-800 dark:text-terracotta-200',
                icon: (
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Verification Rejected',
                description: 'Your verification documents were rejected. Please review the reason and resubmit.',
            };
    }
}

export function VerificationStatusCard(props: VerificationStatusCardProps) {
    const config = getStatusConfig(props.status);

    return (
        <div class={`rounded-xl border-2 ${config.bg} ${config.border} p-6`}>
            <div class="flex items-start gap-4">
                <div class={`flex-shrink-0 ${config.text}`}>
                    {config.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class={`text-lg font-semibold ${config.text}`}>
                        {config.title}
                    </h3>
                    <p class={`mt-1 text-sm ${config.text} opacity-80`}>
                        {config.description}
                    </p>

                    {props.status === 'REJECTED' && props.rejectionReason && (
                        <div class="mt-4 p-4 bg-terracotta-100 dark:bg-terracotta-900/40 rounded-lg border border-terracotta-200 dark:border-terracotta-800">
                            <p class="text-sm font-medium text-terracotta-900 dark:text-terracotta-100 mb-1">
                                Rejection Reason:
                            </p>
                            <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                                {props.rejectionReason}
                            </p>
                        </div>
                    )}

                    {props.status === 'APPROVED' && props.verifiedAt && (
                        <p class="mt-2 text-xs text-sage-600 dark:text-sage-400">
                            Verified on {new Date(props.verifiedAt).toLocaleDateString()}
                        </p>
                    )}

                    {props.updatedAt && (
                        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Last updated: {new Date(props.updatedAt).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
