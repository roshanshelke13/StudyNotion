import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) {
  const [currChart, setCurrChart] = useState("students")

  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      colors.push(
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`
      )
    }
    return colors
  }

  const courseNames = courses.map((c) => c.courseName || "Untitled")
  const studentCounts = courses.map((c) => Number(c.totalStudents) || 0)
  const incomeValues = courses.map((c) => Number(c.totalAmount) || 0)

  const chartDataStudents = {
    labels: courseNames,
    datasets: [
      {
        data: studentCounts,
        backgroundColor: generateRandomColors(courseNames.length),
      },
    ],
  }

  const chartIncomeData = {
    labels: courseNames,
    datasets: [
      {
        data: incomeValues,
        backgroundColor: generateRandomColors(courseNames.length),
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#fff" },
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 min-h-[500px]">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Make this container 600×600px */}
      <div
        className="mx-auto"
        style={{ width: 600, height: 600 }}
      >
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
