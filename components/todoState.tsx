interface Props {
  total: number
  active: number
  completed: number
}

export default function TodoStats({ total, active, completed }: Props) {
 
  return (
    <>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-blue-400">{total}</div>
            <div className="text-slate-400 text-sm">Total Tugas</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-yellow-400">{active}</div>
            <div className="text-slate-400 text-sm">Belum Selesai</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-green-400">{completed}</div>
            <div className="text-slate-400 text-sm">Selesai</div>
        </div>
    </>
  )
}
