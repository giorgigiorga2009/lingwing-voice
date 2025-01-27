export const OvalProgressBar = ({
  progress,
  maxProgress,
}: {
  progress: number;
  maxProgress: number;
}) => {
  // Adjusted radius values for flatter curve
  const radiusX = 442; // Increased for wider spread
  const radiusY = 295; // Reduced for flatter curve
  const strokeWidth = 8; // Slightly thinner stroke

  const arcLength = (Math.PI * radiusX) / 2.21;
  const progressPercentage = Math.min(progress / maxProgress, 1);
  const strokeDashoffset = arcLength - progressPercentage * arcLength;
  return (
    <div
      style={{ position: 'relative', width: '100%', height: '1px', zIndex: 1 }}
    >
      <svg
        viewBox="0 0 600 100" // Adjusted viewBox for better positioning
        width="100%"
        height="450.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Oval */}
        <path
          d={`M0,80 A${radiusX},${radiusY} 0 0,1 600,80`} // Modified path to stretch full width
          fill="none"
          // stroke="#E8E8E8" // Lighter gray for background
          strokeWidth={strokeWidth}
        />

        {/* Progress Oval */}
        <path
          d={`M0,80 A${radiusX},${radiusY} 0 0,1 600,80`} // Modified path to stretch full width
          fill="none"
          stroke="#FF9B05" // Changed to orange color
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
