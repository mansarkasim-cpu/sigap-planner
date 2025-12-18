// filepath: web/app/assignments/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { apiFetch, uploadFilePresign } from "../../lib/api-client";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [signatureFile, setSignatureFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const q = userId ? `?user=${encodeURIComponent(userId)}` : "";
      const data = await apiFetch(`/assignments${q}`);
      setAssignments(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      console.error("fetch assignments error", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }

  function onFiles(e) {
    setSelectedFiles(Array.from(e.target.files || []));
  }
  function onSignature(e) {
    setSignatureFile((e.target.files && e.target.files[0]) || null);
  }

  async function submitRealisasi() {
    if (!selectedAssignment) {
      alert("Select assignment first");
      return;
    }
    setSubmitting(true);
    try {
      // Option A: upload files via presign then send JSON payload with URLs
      const photoUrls = [];
      for (const f of selectedFiles) {
        const uploaded = await uploadFilePresign(f);
        photoUrls.push(uploaded.url);
      }
      let signatureUrl = null;
      if (signatureFile) {
        const uploaded = await uploadFilePresign(signatureFile);
        signatureUrl = uploaded.url;
      }

      const payload = {
        wo_id: selectedAssignment.work_order_id || selectedAssignment.work_order?.wo_id || null,
        assignment_id: selectedAssignment.id,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        actions_taken: "Submitted from web UI",
        man_hours: 1.0,
        notes: "Uploaded from Next.js web",
        photos: photoUrls,
        signature: signatureUrl,
      };

      // Server accepts JSON with file URLs (also supports multipart)
      const res = await apiFetch("/realisasi", { method: "POST", body: payload });
      alert("Realisasi submitted: " + (res.realisasi_id || res.id || "ok"));
      // refresh list
      fetchList();
      // clear
      setSelectedFiles([]);
      setSignatureFile(null);
      setSelectedAssignment(null);
    } catch (err) {
      console.error(err);
      alert("Submit failed: " + (err.message || "error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Assignments</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul>
            {assignments.map((a) => (
              <li key={a.id} style={{ marginBottom: 8 }}>
                <strong>{a.work_order?.title || a.work_order_id}</strong>
                <div>Assignee: {a.assignee_id}</div>
                <div>Status: {a.status}</div>
                <button onClick={() => setSelectedAssignment(a)} style={{ marginTop: 6 }}>
                  Select
                </button>
              </li>
            ))}
          </ul>

          <hr />

          <h2>Submit Realisasi</h2>
          <div>
            <div>Selected assignment: {selectedAssignment ? selectedAssignment.id : "—"}</div>
            <input type="file" multiple onChange={onFiles} />
            <div style={{ marginTop: 8 }}>
              <label>Signature (PNG): </label>
              <input type="file" accept="image/png" onChange={onSignature} />
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={submitRealisasi} disabled={submitting || !selectedAssignment}>
                {submitting ? "Submitting..." : "Submit Realisasi"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}