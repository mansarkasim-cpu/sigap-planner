'use client'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

/**
 * HelpTooltip — kontekstual help tooltip dengan ikon tanda tanya.
 *
 * Props:
 *   title   {string|ReactNode} — teks penjelasan yang muncul saat hover/focus
 *   size    {'small'|'medium'}  — ukuran ikon (default 'small')
 *   sx      {object}           — override MUI sx styling pada IconButton
 *   placement — MUI Tooltip placement (default 'top')
 */
export default function HelpTooltip({ title, size = 'small', sx = {}, placement = 'top' }) {
  if (!title) return null
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={4000}
    >
      <IconButton
        size={size}
        tabIndex={0}
        aria-label="Bantuan"
        sx={{ color: 'text.secondary', p: 0.25, ml: 0.5, verticalAlign: 'middle', ...sx }}
      >
        <HelpOutlineIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  )
}
