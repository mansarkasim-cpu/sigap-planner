"use client"
import React, { useEffect, useState } from 'react'
import TechnicianCard from './TechnicianCard'
import { apiFetch } from '../lib/api-client'

// Renders a responsive grid of TechnicianCard
export default function TechnicianList({ fetchUrl, data }){
  const [techs, setTechs] = useState(data || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      if (data) return
      if (!fetchUrl) {
        // no fetch url and no data -> use sample
        setTechs(sampleData)
        return
      }
      setLoading(true)
      try{
        const res = await apiFetch(fetchUrl)
        if (!mounted) return

        // common backend shape: { assignments: [...], tasks: [...] }
        if (res && Array.isArray(res.assignments)) {
          const assignments = res.assignments || []
          const tasksById = new Map(((res.tasks || [])).map(t => [String(t.id), t]))

          // group assignments by assigneeId
          const grouped = {}
          assignments.forEach(a => {
            const assignee = String(a.assigneeId || a.assignee || 'unassigned')
            const name = (a.assigneeName || (a.assignee && a.assignee.name) || assignee) || assignee
            if (!grouped[assignee]) grouped[assignee] = { id: assignee, name, tasks: [] }

            const wo = a.wo || a.workOrder || {}
            const taskTitle = a.task_name || (a.task_id ? (tasksById.get(String(a.task_id)) || {}).name : undefined) || a.task || 'Tugas'
            grouped[assignee].tasks.push({ id: a.id, title: taskTitle, wo_number: (wo && (wo.doc_no || wo.number || wo.docNo)) || (a.wo && a.wo.doc_no) || '-', status: a.status || a.assignment_status || 'UNKNOWN' })
          })

          setTechs(Object.values(grouped))
        } else if (Array.isArray(res) && res.length>0 && res[0].tasks === undefined && res[0].technician) {
          // maybe endpoint returned items with .technician and task info -> group
          const grouped = {}
          res.forEach(item =>{
            const t = item.technician || { id: 'unknown', name: 'Unknown' }
            const key = t.id || t.name
            if (!grouped[key]) grouped[key] = { id: key, name: t.name || key, tasks: [] }
            grouped[key].tasks.push({ id: item.id, title: item.title || item.task || '-', wo_number: item.wo_number || item.work_order || '-', status: item.status || item.task_status || 'unknown' })
          })
          setTechs(Object.values(grouped))
        } else if (Array.isArray(res)) {
          setTechs(res)
        } else {
          setTechs(sampleData)
        }
      }catch(e){
        setError(e.message || String(e))
        setTechs(sampleData)
      }finally{ if (mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [fetchUrl, data])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{color:'red'}}>Error: {error}</div>

  const list = techs || []

  return (
    <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
      {list.map(t => (
        <TechnicianCard key={t.id || t.name} technician={t} />
      ))}
    </div>
  )
}

const sampleData = [
  { id: 'tech-1', name: 'Budi', tasks: [ { id:1, title:'Periksa Panel', wo_number:'WO-1001', status:'In Progress' }, { id:2, title:'Ganti Fuse', wo_number:'WO-1002', status:'Done' } ] },
  { id: 'tech-2', name: 'Siti', tasks: [ { id:3, title:'Kalibrasi Meter', wo_number:'WO-1003', status:'Pending' } ] },
]
