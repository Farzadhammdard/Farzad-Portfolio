"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/ui/language-provider";

const maxUploadSizeBytes = 4 * 1024 * 1024;

const adminCopy = {
  fa: {
    loadContentFailed: "بارگذاری محتوا انجام نشد.",
    loadAdminDataFailed: "دریافت اطلاعات ادمین انجام نشد.",
    sessionExpired: "نشست شما منقضی شده است.",
    sessionExpiredLoginAgain: "نشست منقضی شد. دوباره وارد شوید.",
    imageAddedSaveToPublish: "عکس آپلود و اضافه شد. برای انتشار، ذخیره کنید.",
    uploadFailed: "آپلود انجام نشد.",
    uploadTooLarge: "حجم تصویر زیاد است. حداکثر 4MB مجاز است.",
    cloudinarySetupRequired:
      "Cloudinary تنظیم نشده است. در Vercel متغیرهای CLOUDINARY_CLOUD_NAME، CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET را اضافه کنید و دوباره Deploy بزنید.",
    invalidCredentials: "نام کاربری یا رمز عبور درست نیست.",
    loginSuccess: "ورود با موفقیت انجام شد.",
    loginRequestFailed: "درخواست ورود ناموفق بود.",
    saveFailed: "ذخیره انجام نشد.",
    saveChangesFailed: "ثبت تغییرات انجام نشد.",
    saveSuccess: "تغییرات ذخیره شد.",
    newAdminRequired: "نام کاربری و رمز عبور ادمین جدید الزامی است.",
    addAdminFailed: "افزودن ادمین انجام نشد.",
    addAdminSuccess: "ادمین جدید اضافه شد.",
    projectImageUploaded: "عکس پروژه آپلود شد.",
    galleryImageUploaded: "عکس گالری آپلود شد.",
    loginTitle: "ورود ادمین",
    loginSubtitle: "با حساب ادمین وارد شوید.",
    username: "نام کاربری",
    usernamePlaceholder: "نام کاربری را وارد کنید",
    password: "رمز عبور",
    login: "ورود",
    panelTitle: "پنل ادمین",
    lastUpdate: "آخرین بروزرسانی",
    saving: "در حال ذخیره...",
    save: "ذخیره",
    logout: "خروج",
    adminsTitle: "ادمین‌ها",
    currentAdmins: "ادمین‌های فعلی",
    newUsernamePlaceholder: "نام کاربری جدید",
    newPasswordPlaceholder: "رمز عبور جدید",
    adding: "در حال افزودن...",
    addAdmin: "افزودن ادمین",
    projectsTitle: "پروژه‌ها",
    addProjectTop: "افزودن پروژه (بالا)",
    projectItem: "پروژه",
    remove: "حذف",
    idPlaceholder: "شناسه",
    titlePlaceholder: "عنوان",
    descPlaceholder: "توضیحات",
    stackPlaceholder: "تکنولوژی‌ها: React, Next.js",
    selectImage: "انتخاب تصویر",
    uploadFromComputer: "آپلود از کامپیوتر",
    uploading: "در حال آپلود...",
    uploadImagePrompt: "یک عکس از کامپیوتر آپلود کنید",
    galleryTitle: "گالری",
    uploadAndAdd: "آپلود و افزودن",
    addGalleryImage: "افزودن عکس گالری",
    uploadingAndAdding: "در حال آپلود و افزودن تصویر...",
    galleryItem: "گالری"
  },
  en: {
    loadContentFailed: "Could not load content.",
    loadAdminDataFailed: "Failed to load admin data.",
    sessionExpired: "Session expired.",
    sessionExpiredLoginAgain: "Session expired. Please login again.",
    imageAddedSaveToPublish: "Image uploaded and added. Click Save to publish.",
    uploadFailed: "Upload failed.",
    uploadTooLarge: "Image is too large. Max size is 4MB.",
    cloudinarySetupRequired:
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel and redeploy.",
    invalidCredentials: "Username or password is not correct.",
    loginSuccess: "Logged in successfully.",
    loginRequestFailed: "Login request failed.",
    saveFailed: "Save failed.",
    saveChangesFailed: "Failed to save changes.",
    saveSuccess: "Changes were saved.",
    newAdminRequired: "New admin username and password are required.",
    addAdminFailed: "Failed to add admin.",
    addAdminSuccess: "New admin added.",
    projectImageUploaded: "Project image uploaded.",
    galleryImageUploaded: "Gallery image uploaded.",
    loginTitle: "Admin Login",
    loginSubtitle: "Login with your admin account.",
    username: "Username",
    usernamePlaceholder: "Enter username",
    password: "Password",
    login: "Login",
    panelTitle: "Admin Panel",
    lastUpdate: "Last update",
    saving: "Saving...",
    save: "Save",
    logout: "Logout",
    adminsTitle: "Admins",
    currentAdmins: "Current admins",
    newUsernamePlaceholder: "new username",
    newPasswordPlaceholder: "new password",
    adding: "Adding...",
    addAdmin: "Add Admin",
    projectsTitle: "Projects",
    addProjectTop: "Add Project (Top)",
    projectItem: "Project",
    remove: "Remove",
    idPlaceholder: "id",
    titlePlaceholder: "title",
    specsPlaceholder: "image specs",
    descPlaceholder: "description",
    stackPlaceholder: "stack: React, Next.js",
    selectImage: "Select image",
    uploadFromComputer: "Upload from computer",
    uploading: "Uploading...",
    uploadImagePrompt: "Upload image from computer",
    galleryTitle: "Gallery",
    uploadAndAdd: "Upload & Add",
    addGalleryImage: "Add Gallery Image",
    uploadingAndAdding: "Uploading and adding image...",
    galleryItem: "Gallery"
  }
};

function createEmptyProject() {
  return {
    id: `project-${Date.now()}`,
    title: "",
    description: "",
    image: "",
    stack: []
  };
}

function createEmptyGalleryItem() {
  return {
    id: `gallery-${Date.now()}`,
    title: "",
    specs: "",
    src: ""
  };
}

function createGalleryItemFromUpload(src, fileName = "") {
  const baseName = String(fileName || "")
    .replace(/\.[^/.]+$/, "")
    .trim();

  return {
    id: `gallery-${Date.now()}`,
    title: baseName || "gallery-image",
    specs: "",
    src
  };
}

function normalizeProjects(projects) {
  return projects.map((project, index) => ({
    ...project,
    id: project.id?.trim() || `project-${index + 1}`,
    title: project.title?.trim() || `Project ${index + 1}`,
    description: project.description?.trim() || "",
    image: project.image?.trim() || "",
    stack: Array.isArray(project.stack)
      ? project.stack.map((item) => String(item).trim()).filter(Boolean)
      : String(project.stack || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
  }));
}

function normalizeGalleryItems(items) {
  return items.map((item, index) => ({
    ...item,
    id: item.id?.trim() || `gallery-${index + 1}`,
    title: item.title?.trim() || `Gallery ${index + 1}`,
    specs: item.specs?.trim() || "",
    src: item.src?.trim() || ""
  }));
}

async function parseJsonResponse(response) {
  return response.json();
}

export function AdminDashboard() {
  const { language } = useLanguage();
  const copy = language === "en" ? adminCopy.en : adminCopy.fa;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [saving, setSaving] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [uploadingProjectIndex, setUploadingProjectIndex] = useState(null);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState(null);
  const [isQuickUploadingGallery, setIsQuickUploadingGallery] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [projects, setProjects] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageOptions, setImageOptions] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const formattedUpdatedAt = useMemo(() => {
    if (!updatedAt) {
      return "";
    }
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString();
  }, [updatedAt]);

  async function loadImageOptions() {
    const response = await fetch("/api/admin/images", {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });

    if (response.ok) {
      const payload = await parseJsonResponse(response);
      setImageOptions(payload.images || []);
      if (payload.warning_code === "cloudinary_not_configured") {
        setErrorMessage(copy.cloudinarySetupRequired);
      } else if (payload.warning) {
        setErrorMessage(payload.warning);
      }
    }
  }

  async function loadAdminUsers() {
    const response = await fetch("/api/admin/users", {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });

    if (response.ok) {
      const payload = await parseJsonResponse(response);
      setAdminUsers(payload.users || []);
    }
  }

  async function loadContent() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCheckingSession(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setProjects([]);
        setGalleryImages([]);
        setAdminUsers([]);
        setImageOptions([]);
        return;
      }

      if (!response.ok) {
        throw new Error(copy.loadContentFailed);
      }

      const payload = await parseJsonResponse(response);
      setIsAuthenticated(true);
      setProjects(payload.projects || []);
      setGalleryImages(payload.galleryImages || []);
      setUpdatedAt(payload.updatedAt || "");

      await Promise.all([loadImageOptions(), loadAdminUsers()]);
    } catch (error) {
      console.error(error);
      setErrorMessage(copy.loadAdminDataFailed);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingSession(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  async function uploadImage(file) {
    if (file.size > maxUploadSizeBytes) {
      throw new Error(copy.uploadTooLarge);
    }

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/images", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    if (response.status === 401) {
      setIsAuthenticated(false);
      throw new Error(copy.sessionExpired);
    }

    let payload = null;
    try {
      payload = await parseJsonResponse(response);
    } catch {
      payload = null;
    }

    if (!response.ok) {
      if (payload?.error_code === "cloudinary_not_configured") {
        throw new Error(copy.cloudinarySetupRequired);
      }
      throw new Error(payload?.error || `${copy.uploadFailed} (HTTP ${response.status})`);
    }

    setImageOptions((prev) => [payload.image, ...prev.filter((item) => item.src !== payload.image.src)]);
    return payload.image.src;
  }

  async function handleQuickGalleryUpload(file) {
    setIsQuickUploadingGallery(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const src = await uploadImage(file);
      setGalleryImages((prev) => [createGalleryItemFromUpload(src, file.name), ...prev]);
      setSuccessMessage(copy.imageAddedSaveToPublish);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.uploadFailed);
    } finally {
      setIsQuickUploadingGallery(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        setErrorMessage(copy.invalidCredentials);
        return;
      }

      setPassword("");
      await loadContent();
      setSuccessMessage(copy.loginSuccess);
    } catch (error) {
      console.error(error);
      setErrorMessage(copy.loginRequestFailed);
    }
  }

  async function handleLogout() {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setIsAuthenticated(false);
      setProjects([]);
      setGalleryImages([]);
      setImageOptions([]);
      setAdminUsers([]);
      setUpdatedAt("");
      setUsername("");
      setPassword("");
    }
  }

  async function handleSave() {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          projects: normalizeProjects(projects),
          galleryImages: normalizeGalleryItems(galleryImages)
        })
      });
      const payload = await parseJsonResponse(response).catch(() => null);

      if (response.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage(copy.sessionExpiredLoginAgain);
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.error || copy.saveFailed);
      }

      setProjects(payload.projects || []);
      setGalleryImages(payload.galleryImages || []);
      setUpdatedAt(payload.updatedAt || "");
      setSuccessMessage(copy.saveSuccess);
    } catch (error) {
      console.error(error);
      setErrorMessage(copy.saveChangesFailed);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAdmin(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setErrorMessage(copy.newAdminRequired);
      return;
    }

    setIsAddingAdmin(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword
        })
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage(copy.sessionExpiredLoginAgain);
        return;
      }

      const payload = await parseJsonResponse(response);

      if (!response.ok) {
        setErrorMessage(payload?.error || copy.addAdminFailed);
        return;
      }

      setAdminUsers(payload.users || []);
      setNewAdminUsername("");
      setNewAdminPassword("");
      setSuccessMessage(copy.addAdminSuccess);
    } catch (error) {
      console.error(error);
      setErrorMessage(copy.addAdminFailed);
    } finally {
      setIsAddingAdmin(false);
    }
  }

  if (isCheckingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-md rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-strong)] p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-white">{copy.loginTitle}</h1>
        <p className="mt-2 text-sm text-slate-300">{copy.loginSubtitle}</p>

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs text-slate-300">{copy.username}</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              placeholder={copy.usernamePlaceholder}
              className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none focus:border-sky-300/60"
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-slate-300">{copy.password}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none focus:border-sky-300/60"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--ui-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:brightness-110"
          >
            {copy.login}
          </button>
        </form>

        {errorMessage ? <p className="mt-3 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <header className="rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-strong)] p-4 shadow-lg sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-white">{copy.panelTitle}</h1>
            {formattedUpdatedAt ? (
              <p className="text-xs text-slate-400">
                {copy.lastUpdate}: {formattedUpdatedAt}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[var(--ui-accent)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 disabled:opacity-60"
            >
              {saving ? copy.saving : copy.save}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-4 py-2 text-sm text-[var(--ui-text-primary)]"
            >
              {copy.logout}
            </button>
          </div>
        </div>
        {errorMessage ? <p className="mt-2 text-sm text-rose-300">{errorMessage}</p> : null}
        {successMessage ? <p className="mt-2 text-sm text-emerald-300">{successMessage}</p> : null}
      </header>

      <section className="rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface)] p-4 shadow-md sm:p-5">
        <h2 className="text-lg font-semibold text-white">{copy.adminsTitle}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {copy.currentAdmins}: {adminUsers.join(", ") || "-"}
        </p>

        <form onSubmit={handleAddAdmin} className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={newAdminUsername}
            onChange={(event) => setNewAdminUsername(event.target.value.toLowerCase())}
            placeholder={copy.newUsernamePlaceholder}
            className="rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
            required
          />
          <input
            type="password"
            value={newAdminPassword}
            onChange={(event) => setNewAdminPassword(event.target.value)}
            placeholder={copy.newPasswordPlaceholder}
            className="rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
            required
          />
          <button
            type="submit"
            disabled={isAddingAdmin}
            className="rounded-xl border border-sky-300/40 bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-sky-100 disabled:opacity-60"
          >
            {isAddingAdmin ? copy.adding : copy.addAdmin}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{copy.projectsTitle}</h2>
          <button
            type="button"
            onClick={() => setProjects((prev) => [createEmptyProject(), ...prev])}
            className="rounded-xl border border-sky-300/40 bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-sky-100"
          >
            {copy.addProjectTop}
          </button>
        </div>

        {projects.map((project, index) => (
          <article key={`${project.id}-${index}`} className="rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">
                {copy.projectItem} {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => setProjects((prev) => prev.filter((_, i) => i !== index))}
                className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200"
              >
                {copy.remove}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={project.id || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, id: event.target.value } : item)))
                }
                placeholder={copy.idPlaceholder}
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <input
                value={project.title || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))
                }
                placeholder={copy.titlePlaceholder}
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <textarea
                value={project.description || ""}
                onChange={(event) =>
                  setProjects((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, description: event.target.value } : item))
                  )
                }
                rows={3}
                placeholder={copy.descPlaceholder}
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none md:col-span-2"
              />
              <input
                value={Array.isArray(project.stack) ? project.stack.join(", ") : ""}
                onChange={(event) =>
                  setProjects((prev) =>
                    prev.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            stack: event.target.value
                              .split(",")
                              .map((value) => value.trim())
                              .filter(Boolean)
                          }
                        : item
                    )
                  )
                }
                placeholder={copy.stackPlaceholder}
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none md:col-span-2"
              />
              <select
                value={project.image || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, image: event.target.value } : item)))
                }
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none md:col-span-2"
              >
                <option value="">{copy.selectImage}</option>
                {imageOptions.map((option) => (
                  <option key={option.src} value={option.src}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-slate-200">
                {copy.uploadFromComputer}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (!file) {
                      return;
                    }
                    setUploadingProjectIndex(index);
                    setErrorMessage("");
                    setSuccessMessage("");
                    try {
                      const src = await uploadImage(file);
                      setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, image: src } : item)));
                      setSuccessMessage(copy.projectImageUploaded);
                    } catch (error) {
                      setErrorMessage(error instanceof Error ? error.message : copy.uploadFailed);
                    } finally {
                      setUploadingProjectIndex(null);
                    }
                  }}
                />
              </label>
              {uploadingProjectIndex === index ? <span className="text-xs text-sky-200">{copy.uploading}</span> : null}
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)]">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title || `${copy.projectItem} ${index + 1}`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-sm text-slate-400">{copy.uploadImagePrompt}</div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{copy.galleryTitle}</h2>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-slate-200">
              {copy.uploadAndAdd}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) {
                    return;
                  }
                  await handleQuickGalleryUpload(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => setGalleryImages((prev) => [createEmptyGalleryItem(), ...prev])}
              className="rounded-xl border border-sky-300/40 bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-sky-100"
            >
              {copy.addGalleryImage}
            </button>
          </div>
        </div>
        {isQuickUploadingGallery ? <p className="text-xs text-sky-200">{copy.uploadingAndAdding}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {galleryImages.map((item, index) => (
            <article key={`${item.id}-${index}`} className="rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface)] p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">
                  {copy.galleryItem} {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
                  className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200"
                >
                  {copy.remove}
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={item.id || ""}
                  onChange={(event) =>
                    setGalleryImages((prev) =>
                      prev.map((galleryItem, i) => (i === index ? { ...galleryItem, id: event.target.value } : galleryItem))
                    )
                  }
                  placeholder={copy.idPlaceholder}
                  className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
                />
                <input
                  value={item.title || ""}
                  onChange={(event) =>
                    setGalleryImages((prev) =>
                      prev.map((galleryItem, i) =>
                        i === index ? { ...galleryItem, title: event.target.value } : galleryItem
                      )
                    )
                  }
                  placeholder={copy.titlePlaceholder}
                  className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
                />
                <input
                  value={item.specs || ""}
                  onChange={(event) =>
                    setGalleryImages((prev) =>
                      prev.map((galleryItem, i) =>
                        i === index ? { ...galleryItem, specs: event.target.value } : galleryItem
                      )
                    )
                  }
                  placeholder={copy.specsPlaceholder || "specs"}
                  className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
                />
                <select
                  value={item.src || ""}
                  onChange={(event) =>
                    setGalleryImages((prev) =>
                      prev.map((galleryItem, i) => (i === index ? { ...galleryItem, src: event.target.value } : galleryItem))
                    )
                  }
                  className="w-full rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-[var(--ui-text-primary)] outline-none"
                >
                  <option value="">{copy.selectImage}</option>
                  {imageOptions.map((option) => (
                    <option key={option.src} value={option.src}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label className="inline-flex cursor-pointer items-center rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] px-3 py-2 text-sm text-slate-200">
                  {copy.uploadFromComputer}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (!file) {
                        return;
                      }
                      setUploadingGalleryIndex(index);
                      setErrorMessage("");
                      setSuccessMessage("");
                      try {
                        const src = await uploadImage(file);
                        setGalleryImages((prev) =>
                          prev.map((galleryItem, i) => (i === index ? { ...galleryItem, src } : galleryItem))
                        );
                        setSuccessMessage(copy.galleryImageUploaded);
                      } catch (error) {
                        setErrorMessage(error instanceof Error ? error.message : copy.uploadFailed);
                      } finally {
                        setUploadingGalleryIndex(null);
                      }
                    }}
                  />
                </label>
                {uploadingGalleryIndex === index ? <span className="block text-xs text-sky-200">{copy.uploading}</span> : null}
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)]">
                {item.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.title || `${copy.galleryItem} ${index + 1}`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">{copy.uploadImagePrompt}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

