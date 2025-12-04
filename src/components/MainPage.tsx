import { useState, useRef } from "react";

const MainPage = () => {
  const initialPuzzles = [
    { id: 1, position: 0 },
    { id: 2, position: 1 },
    { id: 3, position: 2 },
    { id: 4, position: 3 },
    { id: 5, position: 4 },
    { id: 6, position: 5 },
    { id: 7, position: 6 },
    { id: 8, position: 7 },
    { id: 9, position: 8 },
  ];

  const [puzzles, setPuzzles] = useState(initialPuzzles);
  const [draggedItem, setDraggedItem] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState(new Set());
  const [reviewMode, setReviewMode] = useState(false);
  const fileInputRef = useRef(null);

  const sortedPuzzles = [...puzzles].sort((a, b) => a.position - b.position);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        reset(); // Reset puzzle positions when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (puzzle) => {
    setDraggedItem(puzzle);
  };

  const handleDrop = (targetPosition) => {
    if (!draggedItem) return;

    const newPuzzles = [...puzzles];
    const draggedIndex = newPuzzles.findIndex((p) => p.id === draggedItem.id);
    const targetIndex = newPuzzles.findIndex(
      (p) => p.position === targetPosition,
    );

    const tempPosition = newPuzzles[draggedIndex].position;
    newPuzzles[draggedIndex].position = newPuzzles[targetIndex].position;
    newPuzzles[targetIndex].position = tempPosition;

    setPuzzles(newPuzzles);
    setDraggedItem(null);

    setAnimatingPieces(new Set([draggedItem.id]));

    setTimeout(() => {
      setAnimatingPieces(new Set());
    }, 200);

    const isSorted = newPuzzles.every((item, idx) => item.position === idx);

    if (isSorted) alert("Done !");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const shuffle = () => {
    const shuffled = [...puzzles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPos = shuffled[i].position;
      shuffled[i].position = shuffled[j].position;
      shuffled[j].position = tempPos;
    }
    setPuzzles(shuffled);
  };

  const reset = () => {
    setPuzzles(initialPuzzles);
  };

  const onReviewImg = () => {
    setReviewMode(!reviewMode);
  };

  const getBackgroundPosition = (id) => {
    const row = Math.floor((id - 1) / 3);
    const col = (id - 1) % 3;
    return `${col * 50}% ${row * 50}%`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-15px) scale(1.05);
    }
    50% {
      transform: translateY(0) scale(1);
    }
    75% {
      transform: translateY(-8px) scale(1.02);
    }
  }
`}</style>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            width: "100px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Upload Image
        </button>
        <button
          onClick={shuffle}
          style={{
            padding: "10px 20px",
            background: "#2929d1",
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Shuffle
        </button>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            color: "white",
            background: "grey",
            cursor: "pointer",
            border: "none",
            borderRadius: "5px",
          }}
        >
          reset
        </button>
        <button
          onClick={onReviewImg}
          style={{
            padding: "10px 20px",
            color: "white",
            background: "grey",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          review img
        </button>
      </div>

      <div
        style={{
          width: "450px",
          height: "450px",
          border: "1px solid pink",
          borderRadius: "8px",
          padding: "10px",
          background: "#374053",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {reviewMode ? (
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={uploadedImage}
            alt={"image here"}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: "10px",
              height: "100%",
            }}
          >
            {sortedPuzzles.map((puzzle) => (
              <div
                key={puzzle.position}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(puzzle.position)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "5px",
                  animation: animatingPieces.has(puzzle.id)
                    ? "bounce 0.6s ease"
                    : "none",
                }}
              >
                <div
                  draggable
                  onDragStart={() => handleDragStart(puzzle)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    background: uploadedImage
                      ? `url(${uploadedImage})`
                      : `blue`,
                    backgroundSize: uploadedImage ? "300% 300%" : "cover",
                    backgroundPosition: uploadedImage
                      ? getBackgroundPosition(puzzle.id)
                      : "center",
                    cursor: "grab",
                    borderRadius: "5px",
                    color: uploadedImage ? "transparent" : "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                    userSelect: "none",
                    transition: "transform 0.2s, opacity 0.2s",
                    opacity: draggedItem?.id === puzzle.id ? 0.5 : 1,
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.cursor = "grabbing")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
                >
                  {puzzle.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
