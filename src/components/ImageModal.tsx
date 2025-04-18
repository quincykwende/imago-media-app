'use client';
import { Dialog } from '@headlessui/react';
import { MediaItem } from '@/types/media';
import ImageWithFallback from './ImageWithFallback';

export default function ImageModal({ item, isOpen, onClose }: {
    item: MediaItem | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl max-w-4xl w-full">
                    <div className="p-6">
                        <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            width={1200}
                            height={800}
                            className="w-full max-h-[70vh] object-contain"
                        />
                        <div className="mt-4 space-y-2">
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            {item.metadata.photographer && (
                                <p className="text-gray-600">By {item.metadata.photographer}</p>
                            )}
                            {item.metadata.date && (
                                <p className="text-sm text-gray-500">
                                    {new Date(item.metadata.date).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
