import React, { useState, useEffect } from "react";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(15);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [speed, setSpeed] = useState("Fast");
  const [speedMultiplier, setSpeedMultiplier] = useState(300); // Default speed
  const [barColor, setBarColor] = useState("Blue");

  useEffect(() => {
    generateRandomArray();
  }, [size]);

  useEffect(() => {
    // Set speed multiplier based on the selected speed
    switch (speed) {
      case "Fast":
        setSpeedMultiplier(200);
        break;
      case "Medium":
        setSpeedMultiplier(500);
        break;
      case "Slow":
        setSpeedMultiplier(800);
        break;
      default:
        setSpeedMultiplier(300);
    }
  }, [speed]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  const visualizeSorting = async (algorithm) => {
    setIsSorting(true);
    let newArray = [...array];

    switch (algorithm) {
      case "Heap Sort":
        await heapSort(newArray);
        break;
      case "Insertion Sort":
        await insertionSort(newArray);
        break;
      case "Merge Sort":
        await mergeSort(newArray);
        break;
      case "Quick Sort":
        await quickSort(newArray);
        break;
      default:
        return;
    }

    setArray(newArray);
    setIsSorting(false);
  };

  const heapSort = async (array) => {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(array, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      await swap(array, i, 0);
      await heapify(array, i, 0);
    }
  };

  const heapify = async (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      await swap(arr, i, largest);
      await heapify(arr, n, largest);
    }
  };

  const insertionSort = async (array) => {
    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;

      while (j >= 0 && array[j] > key) {
        setCurrentIndices([j, j + 1]); // Highlight current comparison
        await sleep(speedMultiplier); // Delay for visualization
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = key;
      setCurrentIndices([j + 1]); // Highlight the insertion position
      await sleep(speedMultiplier); // Delay for visualization
    }
  };

  const mergeSort = async (array) => {
    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = await mergeSort(array.slice(0, mid));
    const right = await mergeSort(array.slice(mid));

    const mergedArray = await merge(left, right);
    
    for (let i = 0; i < mergedArray.length; i++) {
      array[i] = mergedArray[i];
      await sleep(speedMultiplier); // Delay for visualization
      setArray([...array]); // Update the state with the new sorted array
    }
    return array;
  };

  const merge = async (left, right) => {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      setCurrentIndices([i + j]); // Highlight current comparison
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
      await sleep(speedMultiplier); // Delay for visualization
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  };

  const quickSort = async (array) => {
    if (array.length <= 1) return array;

    const pivotIndex = array.length - 1;
    const pivot = array[pivotIndex];
    const left = [];
    const right = [];

    for (let i = 0; i < pivotIndex; i++) {
      setCurrentIndices([i, pivotIndex]); // Highlight current comparison with pivot
      await sleep(speedMultiplier); // Delay for visualization
      if (array[i] < pivot) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }

    const sortedLeft = await quickSort(left);
    const sortedRight = await quickSort(right);
    
    const sortedArray = [...sortedLeft, pivot, ...sortedRight];
    
    for (let i = 0; i < sortedArray.length; i++) {
      array[i] = sortedArray[i];
      await sleep(speedMultiplier); // Delay for visualization
      setArray([...array]); // Update the state with the new sorted array
    }
    return array;
  };

  const swap = async (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    setCurrentIndices([i, j]); // Highlight swapped elements
    await sleep(speedMultiplier); // Delay for visualization
  };

  return (
    <div>
      <h1>Sorting Visualizer</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
        {array.map((value, index) => {
          let color = barColor;
          if (currentIndices.includes(index)) {
            color = "Red"; // Highlight currently compared or swapped elements
          }
          return (
            <div
              key={index}
              style={{
                height: `${value * 3}px`,
                width: "25px",
                backgroundColor: color,
                margin: "0 2px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold" }}>{value}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
        <button onClick={() => visualizeSorting("Heap Sort")} disabled={isSorting}>Heap Sort</button>
        <button onClick={() => visualizeSorting("Insertion Sort")} disabled={isSorting}>Insertion Sort</button>
        <button onClick={() => visualizeSorting("Merge Sort")} disabled={isSorting}>Merge Sort</button>
        <button onClick={() => visualizeSorting("Quick Sort")} disabled={isSorting}>Quick Sort</button>
        <button onClick={generateRandomArray} disabled={isSorting}>Randomize Array</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        <label>Array Size:</label>
        <input 
          type="range" 
          min="3" 
          max="50" 
          value={size} 
          onChange={(e) => setSize(e.target.value)} 
          disabled={isSorting} 
        />
        <span>{size}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        <label>Speed:</label>
        <select value={speed} onChange={(e) => setSpeed(e.target.value)} disabled={isSorting}>
          <option value="Fast">Fast</option>
          <option value="Medium">Medium</option>
          <option value="Slow">Slow</option>
        </select>
      </div>
    </div>
  );
};

export default SortingVisualizer;
