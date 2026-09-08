export default function AvatarNeutro({ size = 40 }) {
  return (
    <div
      className="bg-gray-200 rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="text-gray-400"
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )
}