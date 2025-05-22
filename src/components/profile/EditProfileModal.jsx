/**
 * EditProfileModal.jsx
 * 
 * Loaf Life – Modal form for editing user profile details including name, school, and bio.
 * 
 * This component is a reusable modal UI that allows users to update personal details,
 * with validation messages and character counters. It is used in the ProfilePage.
 *
 * Props:
 * - editName (string): current editable name value
 * - setEditName (function): updates name value
 * - editSchool (string): current editable school value
 * - setEditSchool (function): updates school value
 * - editBio (string): current editable bio value
 * - setEditBio (function): updates bio value
 * - errors (object): validation error messages for each field
 * - setErrors (function): updates error state
 * - isFormValid (boolean): determines if Save button should be enabled
 * - onCancel (function): closes the modal without saving
 * - onSave (function): triggers save logic when form is valid
 *
 * Refactored from ProfilePage with assistance from ChatGPT o4-mini-high.
 * Portions of the layout, error logic, and styling were guided by ChatGPT for learning purposes.
 *
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 *
 * @function EditProfileModal
 * @description Displays a modal with editable input fields and handles inline validation.
 */

/**
 * EditProfileModal
 * 
 * @function EditProfileModal
 * @returns {JSX.Element} A modal form component for editing profile details.
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
        // Full-screen overlay with semi-transparent background
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            {/* Modal container */}
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Edit Profile</h2>

                {/* ---------- Name Field ---------- */}
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
                    {/* Inline feedback + character counter */}
                    <div className="flex justify-between mt-1 text-xs">
                        <span className="text-gray-500">{editName.length}/50 characters</span>
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                </div>

                {/* ---------- School Field ---------- */}
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

                {/* ---------- Bio Field ---------- */}
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

                {/* ---------- Action Buttons ---------- */}
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
