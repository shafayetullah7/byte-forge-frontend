import { Show } from 'solid-js';
import { useI18n } from '~/i18n';

export interface FilePreviewCardProps {
    url: string;
    fileName: string;
    mimeType?: string;
    size?: number;
    label?: string;
}

/**
 * Helper function to detect if a file is an image based on filename
 */
function isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Reusable file preview card component
 * Shows image thumbnail or document icon with view button
 * 
 * @example
 * ```tsx
 * <FilePreviewCard 
 *     label="Trade License"
 *     url={media.url}
 *     fileName={media.fileName}
 *     size={media.size}
 * />
 * ```
 */
export function FilePreviewCard(props: FilePreviewCardProps) {
    const { t } = useI18n();
    
    return (
        <div>
            <Show when={props.label}>
                <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {props.label}
                </h4>
            </Show>
            
            <div class="space-y-3">
                {/* File Preview Card */}
                <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {/* File Icon/Preview */}
                    <div class="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                        {isImageFile(props.fileName) ? (
                            <>
                                <img 
                                    src={props.url} 
                                    alt={`${props.fileName} preview`}
                                    class="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to document icon if image fails to load
                                        e.currentTarget.style.display = 'none';
                                        const icon = e.currentTarget.nextElementSibling as SVGElement;
                                        if (icon) {
                                            icon.classList.remove('hidden');
                                        }
                                    }}
                                />
                                {/* Hidden document icon (shown on error) */}
                                <svg class="w-6 h-6 text-slate-400 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </>
                        ) : (
                            <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                    </div>
                    
                    {/* File Info */}
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                            {props.fileName}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('seller.verification.clickToViewDocument')}
                            <Show when={props.size}>
                                {' • ' + formatFileSize(props.size!)}
                            </Show>
                        </p>
                    </div>
                </div>
                
                {/* View Button */}
                <a 
                    href={props.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${t('seller.verification.viewFullDocument')}: ${props.fileName}`}
                    class="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-green-600 dark:text-primary-green-400 bg-primary-green-50 dark:bg-primary-green-900/20 hover:bg-primary-green-100 dark:hover:bg-primary-green-900/30 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('seller.verification.viewFullDocument')}
                </a>
            </div>
        </div>
    );
}
