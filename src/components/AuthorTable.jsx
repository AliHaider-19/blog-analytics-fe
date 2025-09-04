"use client"

import { User, Trophy, Medal, Award } from "lucide-react"

export default function AuthorTable({ authors }) {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
    }
  }

  if (authors.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No authors found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {authors.map((author, index) => (
        <div key={author.author} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index)}</div>
            <div>
              <p className="font-medium">{author.author}</p>
              <p className="text-sm text-muted-foreground">
                {author.count} {author.count === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{author.count}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
