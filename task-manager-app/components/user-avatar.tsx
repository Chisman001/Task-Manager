import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  fullName?: string | null
  avatarUrl?: string | null
  className?: string
}

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserAvatar({ fullName, avatarUrl, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl ?? undefined} alt={fullName ?? 'User'} />
      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
        {getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  )
}
