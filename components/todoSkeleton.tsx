export default function Page(){
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                <div className="flex-1 h-4 bg-slate-700 rounded"></div>
                <div className="flex gap-1">
                <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}