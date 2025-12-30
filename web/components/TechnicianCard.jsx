"use client"
import React from 'react'

function StatusBadge({ status }){
  const color = (status||'').toLowerCase()
  const bg = color === 'done' ? 'bg-green-100 text-green-800' : color === 'in progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
  return (
    <span className={`status-badge ${bg}`} style={{padding:'2px 8px', borderRadius:8, fontSize:12}}>{status}</span>
  )
}

export default function TechnicianCard({ technician }){
  // technician: { id, name, tasks: [{ id, title, wo_number, status }] }
  const tasks = (technician && technician.tasks) || []

  return (
    <div className="technician-card" style={{border:'1px solid #e5e7eb', borderRadius:8, padding:12, width:300, boxSizing:'border-box', background:'#fff'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <strong>{technician?.name || 'Unknown'}</strong>
        <small style={{color:'#6b7280'}}>{tasks.length} tugas</small>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {tasks.length === 0 && <div style={{color:'#6b7280'}}>Tidak ada tugas</div>}

        {tasks.map(t => (
          <div key={t.id || `${t.wo_number}-${t.title}`} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:600}}>{t.title}</div>
              <div style={{fontSize:12, color:'#6b7280'}}>WO: {t.wo_number || '-'}</div>
            </div>
            <div style={{marginLeft:8}}>
              <StatusBadge status={t.status || 'unknown'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
