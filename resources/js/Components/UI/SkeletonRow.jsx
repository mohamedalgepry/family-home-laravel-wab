export function SkeletonRow({ cols }) {
    return (
        <tr className="border-t border-secondary-100">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-secondary-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                </td>
            ))}
        </tr>
    )
}
