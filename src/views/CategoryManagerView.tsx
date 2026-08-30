import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  FolderKanban, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Category } from '../types';

const COLOR_PALETTE = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#78716c', // Stone
];

export const CategoryManagerView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, activities } = useLedger();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PALETTE[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');

  const [confirmDeleteCat, setConfirmDeleteCat] = useState<Category | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAdding(true);
    try {
      const created = await addCategory(newCatName.trim(), newCatColor);
      setNewCatName('');
      setNewCatColor(COLOR_PALETTE[(categories.length + 1) % COLOR_PALETTE.length]);
      showFeedback(`Category "${created.name}" created successfully.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color || COLOR_PALETTE[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory(id, editingName.trim(), editingColor);
      setEditingId(null);
      showFeedback('Category updated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (cat: Category) => {
    try {
      await deleteCategory(cat.id);
      setConfirmDeleteCat(null);
      showFeedback(`Category "${cat.name}" deleted. Any attached activities were safely reassigned to "Uncategorized".`);
    } catch (err) {
      console.error(err);
    }
  };

  const getActivityCount = (categoryId: string) => {
    return activities.filter((a) => a.categoryId === categoryId).length;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light text-[#1A202C] mb-2">Category Manager</h2>
          <p className="text-[#718096] max-w-2xl leading-relaxed">
            Organize your life areas into clear, manageable dimensions. Default categories like Health, Work, Home, and Relationships get you started quickly, and you can create, rename, or customize your own as your priorities evolve.
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F4F2] text-[#4F6D7A] text-xs font-semibold border border-[#EDEAE5]">
            {categories.length} Categories Active
          </span>
        </div>
      </header>

      {feedbackMsg && (
        <div
          id="category-feedback-banner"
          className="p-3.5 rounded-2xl bg-[#F0F4F2] border border-[#EDEAE5] text-xs text-[#4F6D7A] flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-[#4F6D7A] shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Quick-Add New Category Top Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#A0AEC0] mb-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#4F6D7A]" />
          Add a New Category
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              id="input-new-category-name"
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Creative Arts, Finances, Learning & Reading"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C] placeholder:text-gray-400"
            />
          </div>

          {/* Color Picker Dots */}
          <div className="flex items-center gap-2 bg-[#F7F9F9] px-4 py-2.5 rounded-xl border border-[#EDEAE5] shrink-0">
            <span className="text-[11px] font-semibold text-[#718096] mr-1">Color:</span>
            {COLOR_PALETTE.slice(0, 6).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewCatColor(color)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  newCatColor === color ? 'scale-125 ring-2 ring-[#1A202C] ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
                title={`Select color ${color}`}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>

          <button
            id="btn-add-category"
            type="submit"
            disabled={isAdding || !newCatName.trim()}
            className="px-6 py-3 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-lg shadow-[#4F6D7A]/15 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1A202C]">Your Categories</h3>
            <p className="text-xs text-[#718096]">
              Click rename or delete to adjust any category. Deleting a category safely preserves your logged activities by reassigning them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {categories.map((cat) => {
            const count = getActivityCount(cat.id);
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                className="bg-[#F7F9F9] hover:bg-gray-100/80 rounded-2xl p-4 border border-[#EDEAE5] transition-all flex flex-col justify-between gap-3 group"
              >
                {isEditing ? (
                  /* Inline Edit Mode */
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4F6D7A]"
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {COLOR_PALETTE.slice(0, 6).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditingColor(c)}
                            className={`w-4 h-4 rounded-full ${
                              editingColor === c ? 'ring-2 ring-[#1A202C] ring-offset-1' : ''
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1.5 rounded-lg bg-[#4F6D7A] text-white hover:bg-[#3D545E] transition-colors"
                          title="Save Changes"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg bg-gray-200 text-[#2D3748] hover:bg-gray-300 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard View Mode */
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || '#4F6D7A' }}
                        />
                        <span className="text-sm font-semibold text-[#1A202C]">{cat.name}</span>
                        {cat.isDefault && (
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-[#718096]">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          id={`btn-edit-cat-${cat.id}`}
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-lg text-[#718096] hover:text-[#1A202C] hover:bg-gray-200 transition-colors"
                          title="Rename Category"
                          aria-label={`Rename ${cat.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`btn-delete-cat-${cat.id}`}
                          onClick={() => setConfirmDeleteCat(cat)}
                          className="p-1.5 rounded-lg text-[#718096] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Category"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#718096] pt-2 border-t border-[#EDEAE5]">
                      <span>
                        {count} {count === 1 ? 'activity logged' : 'activities logged'}
                      </span>
                      <span className="text-[#A0AEC0]">ID: {cat.id.slice(0, 8)}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteCat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#EDEAE5] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1A202C]">
                  Delete Category "{confirmDeleteCat.name}"?
                </h3>
                <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                  Are you sure you want to remove this category? Any activities currently assigned to this category will automatically be reassigned to{' '}
                  <span className="font-semibold text-[#1A202C]">"Uncategorized"</span> so no records or calculations are lost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfirmDeleteCat(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#718096] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteCat)}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Confirm Delete & Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
