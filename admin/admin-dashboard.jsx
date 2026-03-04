"use client";

import { useEffect, useMemo, useState } from "react";

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
    src: ""
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
    src: item.src?.trim() || ""
  }));
}

async function parseJsonResponse(response) {
  return response.json();
}

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [saving, setSaving] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [uploadingProjectIndex, setUploadingProjectIndex] = useState(null);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState(null);

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
        throw new Error("Could not load content.");
      }

      const payload = await parseJsonResponse(response);
      setIsAuthenticated(true);
      setProjects(payload.projects || []);
      setGalleryImages(payload.galleryImages || []);
      setUpdatedAt(payload.updatedAt || "");

      await Promise.all([loadImageOptions(), loadAdminUsers()]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load admin data.");
      setIsAuthenticated(false);
    } finally {
      setIsCheckingSession(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  async function uploadImage(file) {
    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/images", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    if (response.status === 401) {
      setIsAuthenticated(false);
      throw new Error("Session expired.");
    }

    const payload = await parseJsonResponse(response).catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || "Upload failed.");
    }

    setImageOptions((prev) => [payload.image, ...prev.filter((item) => item.src !== payload.image.src)]);
    return payload.image.src;
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
        setErrorMessage("Username or password is not correct.");
        return;
      }

      setPassword("");
      await loadContent();
      setSuccessMessage("Logged in successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Login request failed.");
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

      if (response.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Save failed.");
      }

      const payload = await parseJsonResponse(response);
      setProjects(payload.projects || []);
      setGalleryImages(payload.galleryImages || []);
      setUpdatedAt(payload.updatedAt || "");
      setSuccessMessage("Changes were saved.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAdmin(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setErrorMessage("New admin username and password are required.");
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
        setErrorMessage("Session expired. Please login again.");
        return;
      }

      const payload = await parseJsonResponse(response);

      if (!response.ok) {
        setErrorMessage(payload?.error || "Failed to add admin.");
        return;
      }

      setAdminUsers(payload.users || []);
      setNewAdminUsername("");
      setNewAdminPassword("");
      setSuccessMessage("New admin added.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add admin.");
    } finally {
      setIsAddingAdmin(false);
    }
  }

  if (isCheckingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Login with your admin account.</p>

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs text-slate-300">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              placeholder="Enter username"
              className="w-full rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300/60"
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300/60"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
            Login
          </button>
        </form>

        {errorMessage ? <p className="mt-3 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
            {formattedUpdatedAt ? <p className="text-xs text-slate-400">Last update: {formattedUpdatedAt}</p> : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200"
            >
              Logout
            </button>
          </div>
        </div>
        {errorMessage ? <p className="mt-2 text-sm text-rose-300">{errorMessage}</p> : null}
        {successMessage ? <p className="mt-2 text-sm text-emerald-300">{successMessage}</p> : null}
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold text-white">Admins</h2>
        <p className="mt-1 text-xs text-slate-400">Current admins: {adminUsers.join(", ") || "-"}</p>

        <form onSubmit={handleAddAdmin} className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={newAdminUsername}
            onChange={(event) => setNewAdminUsername(event.target.value.toLowerCase())}
            placeholder="new username"
            className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
            required
          />
          <input
            type="password"
            value={newAdminPassword}
            onChange={(event) => setNewAdminPassword(event.target.value)}
            placeholder="new password"
            className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
            required
          />
          <button
            type="submit"
            disabled={isAddingAdmin}
            className="rounded-lg border border-sky-300/40 px-3 py-2 text-sm text-sky-100 disabled:opacity-60"
          >
            {isAddingAdmin ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <button
            type="button"
            onClick={() => setProjects((prev) => [createEmptyProject(), ...prev])}
            className="rounded-lg border border-sky-300/40 px-3 py-2 text-sm text-sky-100"
          >
            Add Project (Top)
          </button>
        </div>

        {projects.map((project, index) => (
          <article key={`${project.id}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Project {index + 1}</h3>
              <button
                type="button"
                onClick={() => setProjects((prev) => prev.filter((_, i) => i !== index))}
                className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={project.id || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, id: event.target.value } : item)))
                }
                placeholder="id"
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <input
                value={project.title || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))
                }
                placeholder="title"
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
                placeholder="description"
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
                placeholder="stack: React, Next.js"
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none md:col-span-2"
              />
              <select
                value={project.image || ""}
                onChange={(event) =>
                  setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, image: event.target.value } : item)))
                }
                className="rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none md:col-span-2"
              >
                <option value="">Select image</option>
                {imageOptions.map((option) => (
                  <option key={option.src} value={option.src}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200">
                Upload from computer
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
                      setSuccessMessage("Project image uploaded.");
                    } catch (error) {
                      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
                    } finally {
                      setUploadingProjectIndex(null);
                    }
                  }}
                />
              </label>
              {uploadingProjectIndex === index ? <span className="text-xs text-sky-200">Uploading...</span> : null}
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#020712]">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title || `Project ${index + 1}`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-sm text-slate-400">Upload image from computer</div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Gallery</h2>
          <button
            type="button"
            onClick={() => setGalleryImages((prev) => [createEmptyGalleryItem(), ...prev])}
            className="rounded-lg border border-sky-300/40 px-3 py-2 text-sm text-sky-100"
          >
            Add Gallery Image
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {galleryImages.map((item, index) => (
            <article key={`${item.id}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Gallery {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
                  className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200"
                >
                  Remove
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
                  placeholder="id"
                  className="w-full rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
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
                  placeholder="title"
                  className="w-full rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
                />
                <select
                  value={item.src || ""}
                  onChange={(event) =>
                    setGalleryImages((prev) =>
                      prev.map((galleryItem, i) => (i === index ? { ...galleryItem, src: event.target.value } : galleryItem))
                    )
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#060e21] px-3 py-2 text-sm text-slate-100 outline-none"
                >
                  <option value="">Select image</option>
                  {imageOptions.map((option) => (
                    <option key={option.src} value={option.src}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label className="inline-flex cursor-pointer items-center rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200">
                  Upload from computer
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
                        setSuccessMessage("Gallery image uploaded.");
                      } catch (error) {
                        setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
                      } finally {
                        setUploadingGalleryIndex(null);
                      }
                    }}
                  />
                </label>
                {uploadingGalleryIndex === index ? <span className="block text-xs text-sky-200">Uploading...</span> : null}
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#020712]">
                {item.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt={item.title || `Gallery ${index + 1}`} className="h-40 w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">Upload image from computer</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
