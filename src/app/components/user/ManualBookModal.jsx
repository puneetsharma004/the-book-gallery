"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, ImageIcon, Upload, X, CheckCircle, Pencil } from "lucide-react";

export default function ManualBookModal({
  isOpen,
  onClose,
  title,
  notes,
  status,
  file,
  preview,
  onTitleChange,
  onNotesChange,
  onStatusChange,
  onFileChange,
  onFileRemove,
  onSubmit,
  isSubmitting,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-md lg:max-w-2xl p-0 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.6)] max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 14 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full text-white flex flex-col h-full"
        >
          <div className="p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                Add Book Manually
              </DialogTitle>
              <DialogDescription className="text-white/50 text-xs sm:text-sm">
                Create a custom entry for your library.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto scrollbar-none">
            {/* Book Title */}
            <div>
              <label htmlFor="book-title" className="text-xs sm:text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                Book Title <span className="text-red-400">*</span>
              </label>
              <Input
                id="book-title"
                placeholder="Enter book title…"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="h-11 sm:h-12 bg-white/10 border border-white/20 text-sm sm:text-base text-white placeholder-white/40 rounded-xl backdrop-blur-lg focus:border-white/40 focus:ring-white/40 transition"
                required
                autoComplete="off"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
                <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                Cover Image <span className="text-xs text-white/40">(optional)</span>
              </label>

              {preview ? (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Cover preview"
                      className="w-20 h-28 sm:w-28 sm:h-40 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute left-0 top-0 w-[6px] h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-lg" />
                  </div>

                  <div className="flex flex-col justify-center gap-2 text-white/80 text-center sm:text-left">
                    <span className="text-xs sm:text-sm truncate max-w-[200px]">{file?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onFileRemove}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg cursor-pointer text-xs sm:text-sm h-9 sm:h-10"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("cover-upload-manual").click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file?.type.startsWith("image/")) {
                      onFileChange(file);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-white/20 bg-white/5 rounded-xl p-8 sm:p-10 text-center backdrop-blur-lg cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all active:scale-[0.98]"
                >
                  <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-3 text-white/60" />
                  <p className="text-xs sm:text-sm text-white/70">
                    <span className="hidden sm:inline">Click to upload or drag here</span>
                    <span className="sm:hidden">Tap to upload image</span>
                  </p>

                  <input
                    type="file"
                    id="cover-upload-manual"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileChange(file);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Reading Status */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                Reading Status
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: "reading", label: "Reading", icon: "📖" },
                  { value: "want", label: "Want", icon: "📝" },
                  { value: "read", label: "Finished", icon: "✅" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onStatusChange(option.value)}
                    className={`min-h-[60px] sm:min-h-[72px] p-3 sm:p-4 rounded-xl text-center border backdrop-blur-sm transition-all cursor-pointer active:scale-95
                      ${
                        status === option.value
                          ? "bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.03]"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                  >
                    <span className="text-xl sm:text-2xl block">{option.icon}</span>
                    <span className="text-[10px] sm:text-xs block mt-1">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="book-notes" className="text-xs sm:text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                Notes <span className="text-xs text-white/40">(optional)</span>
              </label>

              <textarea
                id="book-notes"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base leading-relaxed text-white placeholder-white/40 backdrop-blur-sm focus:border-white/40 focus:ring-white/30 transition resize-none min-h-[80px]"
                placeholder="Thoughts, quotes, reflections..."
              />
              <p className="text-xs text-white/40 mt-1 text-right">{notes.length}/500</p>
            </div>
          </div>

          <DialogFooter className="p-3 sm:p-4 border-t border-white/10 flex flex-row gap-2 sm:gap-3 justify-end flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer text-xs sm:text-sm px-4 sm:px-5 h-10 sm:h-11"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={onSubmit}
              className="bg-white/15 border border-white/30 text-white hover:bg-white/20 rounded-lg px-5 sm:px-7 backdrop-blur-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm h-10 sm:h-11 active:scale-95"
            >
              {isSubmitting ? "Adding…" : "Add Book"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
