/**
 * EditProfileModal.jsx
 * Loaf Life – modal form for editing the user's name, school, and bio.
 * 
 * Props:
 * - editName, setEditName
 * - editSchool, setEditSchool
 * - editBio, setEditBio
 * - errors (validation object)
 * - isFormValid (boolean for Save button state)
 * - onCancel (closes modal)
 * - onSave (saves form data)
 * 
 * Portions of form layout, validation handling, and modal logic were assisted by ChatGPT for educational purposes.
 * Refactored from ProfilePage into reusable component.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * @author https://chatgpt.com/*
 */

export default function EditProfileModal({
    editName,
    setEditName,
    editSchool,
    setEditSchool,
    editBio,
    setEditBio,
    errors,
    setErrors,
    isFormValid,
    onCancel,
    onSave,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Edit Profile</h2>

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm text-[#8B4C24] mb-1">Name</label>
                    <input
                        value={editName}
                        onChange={(e) => {
                            setEditName(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                name: e.target.value.trim() ? "" : "Name is required"
                            }));
                        }}
                        className={`w-full border p-2 rounded ${editName.length > 50 ? "border-red-500" : "border-gray-300"}`}
                        maxLength={50}
                    />
                    <div className="flex justify-between mt-1 text-xs">
                        <span className="text-gray-500">{editName.length}/50 characters</span>
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                </div>

                {/* School */}
                <div className="mb-4">
                    <label className="block text-sm text-[#8B4C24] mb-1">School</label>
                    <input
                        value={editSchool}
                        onChange={(e) => {
                            setEditSchool(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                school: e.target.value.trim() ? "" : "School is required"
                            }));
                        }}
                        className={`w-full border p-2 rounded ${editSchool.length > 100 ? "border-red-500" : "border-gray-300"}`}
                        maxLength={100}
                    />
                    <div className="flex justify-between mt-1 text-xs">
                        <span className="text-gray-500">{editSchool.length}/100 characters</span>
                        {errors.school && <span className="text-red-500">{errors.school}</span>}
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                    <label className="block text-sm text-[#8B4C24] mb-1">Bio</label>
                    <textarea
                        value={editBio}
                        onChange={(e) => {
                            setEditBio(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                bio: e.target.value.trim() ? "" : "Bio is required"
                            }));
                        }}
                        className={`w-full border p-2 rounded ${editBio.length > 200 ? "border-red-500" : "border-gray-300"}`}
                        rows={3}
                        maxLength={200}
                        placeholder="Tell us something about yourself..."
                    />
                    <div className="flex justify-between mt-1 text-xs">
                        <span className="text-gray-500">{editBio.length}/200 characters</span>
                        {errors.bio && <span className="text-red-500">{errors.bio}</span>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-3 py-2 rounded hover:bg-[#e3cba8] transition"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!isFormValid}
                        onClick={onSave}
                        className={`font-medium px-4 py-1.5 rounded transition ${!isFormValid
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-[#639751] text-white hover:bg-[#6bb053]"
                            }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
