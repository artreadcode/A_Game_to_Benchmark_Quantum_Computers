"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Zap, Activity, ZoomIn, ZoomOut, RotateCcw, Database, Play } from "lucide-react"
import { QuantumDevice } from "@/lib/quantum-device"
import { HardwareQuantumSimulator } from "@/lib/hardware-quantum-simulator"
import { GameManager } from "@/lib/game-state"
import type { DataFileInfo } from "@/lib/data-loader"

// Device data configuration
const deviceData = {
  ibmqx4: {
    num: 5,
    area: [3, 3],
    entangleType: "CX",
    pairs: {
      A: [1, 0],
      B: [2, 0],
      C: [2, 1],
      D: [4, 2],
      E: [3, 2],
      F: [3, 4],
    },
    pos: { 0: [1, 1], 1: [1, 0], 2: [0.5, 0.5], 3: [0, 0], 4: [0, 1] },
    sdk: "QISKit",
    description: "IBM QX4",
    example: [0.11, 0.09, 0.49, 0.47, 0.31],
  },
  ibmqx5: {
    num: 16,
    area: [8, 2.15],
    entangleType: "CX",
    pairs: {
      A: [1, 2],
      B: [2, 3],
      C: [3, 4],
      D: [5, 4],
      E: [6, 5],
      F: [6, 7],
      G: [8, 7],
      H: [1, 0],
      I: [15, 2],
      J: [3, 14],
      K: [13, 4],
      L: [12, 5],
      M: [6, 11],
      N: [7, 10],
      O: [9, 8],
      P: [15, 0],
      Q: [15, 14],
      R: [13, 14],
      S: [12, 13],
      T: [12, 11],
      U: [11, 10],
      V: [9, 10],
    },
    pos: {
      0: [0, 0],
      1: [0, 1],
      2: [1, 1],
      3: [2, 1],
      4: [3, 1],
      5: [4, 1],
      6: [5, 1],
      7: [6, 1],
      8: [7, 1],
      9: [7, 0],
      10: [6, 0],
      11: [5, 0],
      12: [4, 0],
      13: [3, 0],
      14: [2, 0],
      15: [1, 0],
    },
    sdk: "QISKit",
    description: "IBM QX5",
    example: [0.055, 0.045, 0.25, 0.26, 0.15, 0.45, 0.8, 0.9, 0.24, 0.22, 0.33, 0.31, 0.46, 0.15, 0.42, 0.41],
  },
  ibmqx2: {
    num: 5,
    area: [3, 3],
    entangleType: "CX",
    pairs: {
      A: [0, 1],
      B: [0, 2],
      C: [1, 2],
      D: [4, 2],
      E: [3, 2],
      F: [3, 4],
    },
    pos: { 0: [1, 1], 1: [1, 0], 2: [0.5, 0.5], 3: [0, 0], 4: [0, 1] },
    sdk: "ManualQISKit",
    description: "IBM QX2",
    example: [0.11, 0.09, 0.49, 0.52, 0.31],
  },
  "19Q-Acorn": {
    num: 20,
    area: [10, 4],
    entangleType: "CZ",
    pairs: {
      A: [0, 5],
      B: [0, 6],
      C: [1, 6],
      D: [1, 7],
      E: [2, 7],
      F: [2, 8],
      G: [4, 9],
      H: [5, 10],
      I: [6, 11],
      J: [7, 12],
      K: [8, 13],
      L: [9, 14],
      M: [10, 15],
      N: [10, 16],
      O: [11, 16],
      P: [11, 17],
      Q: [12, 17],
      R: [12, 18],
      S: [13, 18],
      T: [13, 19],
      U: [14, 19],
    },
    pos: {
      0: [1, 3],
      1: [3, 3],
      2: [5, 3],
      4: [9, 3],
      5: [0, 2],
      6: [2, 2],
      7: [4, 2],
      8: [6, 2],
      9: [8, 2],
      10: [1, 1],
      11: [3, 1],
      12: [5, 1],
      13: [7, 1],
      14: [9, 1],
      15: [0, 0],
      16: [2, 0],
      17: [4, 0],
      18: [6, 0],
      19: [8, 0],
    },
    sdk: "Forest",
    description: "Rigetti 19Q-Acorn",
    example: [
      0.16,
      0.24,
      0.29,
      null,
      0.075,
      0.26,
      0.165,
      0.235,
      0.295,
      0.085,
      0.255,
      0.38,
      0.445,
      0.115,
      0.325,
      0.01,
      0.39,
      0.455,
      0.125,
      0.32,
    ],
  },
  "8Q-Agave": {
    num: 8,
    area: [3, 3],
    entangleType: "CZ",
    pairs: {
      A: [0, 1],
      B: [1, 2],
      C: [2, 3],
      D: [3, 4],
      E: [4, 5],
      F: [5, 6],
      G: [6, 7],
      H: [7, 0],
    },
    pos: { 0: [1, 2], 1: [0, 2], 2: [0, 1], 3: [0, 0], 4: [1, 0], 5: [2, 0], 6: [2, 1], 7: [2, 2] },
    sdk: "Forest",
    description: "Rigetti 8Q-Agave",
    example: [0.44, 0.45, 0.06, 0.075, 0.175, 0.165, 0.235, 0.225],
  },
  ibm_kyiv: {
    num: 127,
    area: [16, 13],
    entangleType: "CX",
    pairs: {
      AA: [1, 0],
      AB: [1, 2],
      AC: [3, 2],
      AD: [4, 3],
      AE: [4, 15],
      AF: [5, 4],
      AG: [6, 5],
      AH: [7, 6],
      AI: [7, 8],
      AJ: [8, 9],
      AK: [10, 9],
      AL: [10, 11],
      AM: [11, 12],
      AN: [12, 13],
      AO: [14, 0],
      AP: [14, 18],
      AQ: [16, 8],
      AR: [17, 12],
      AS: [17, 30],
      AT: [18, 19],
      AU: [19, 20],
      AV: [20, 33],
      AW: [21, 20],
      AX: [21, 22],
      AY: [22, 15],
      AZ: [23, 22],
      BA: [23, 24],
      BB: [25, 24],
      BC: [26, 16],
      BD: [26, 25],
      BE: [26, 27],
      BF: [28, 27],
      BG: [29, 28],
      BH: [29, 30],
      BI: [31, 30],
      BJ: [31, 32],
      BK: [32, 36],
      BL: [33, 39],
      BM: [34, 24],
      BN: [35, 28],
      BO: [35, 47],
      BP: [36, 51],
      BQ: [37, 38],
      BR: [38, 39],
      BS: [40, 39],
      BT: [41, 40],
      BU: [41, 53],
      BV: [42, 41],
      BW: [43, 34],
      BX: [43, 42],
      BY: [43, 44],
      BZ: [45, 44],
      CA: [45, 46],
      CB: [47, 46],
      CC: [47, 48],
      CD: [49, 48],
      CE: [49, 50],
      CF: [50, 51],
      CG: [52, 37],
      CH: [53, 60],
      CI: [54, 45],
      CJ: [55, 49],
      CK: [56, 52],
      CL: [56, 57],
      CM: [57, 58],
      CN: [59, 58],
      CO: [59, 60],
      CP: [61, 60],
      CQ: [61, 62],
      CR: [63, 62],
      CS: [63, 64],
      CT: [64, 54],
      CU: [64, 65],
      CV: [66, 65],
      CW: [67, 66],
      CX: [68, 55],
      CY: [68, 67],
      CZ: [69, 68],
      DA: [69, 70],
      DB: [71, 58],
      DC: [71, 77],
      DD: [72, 62],
      DE: [73, 66],
      DF: [73, 85],
      DG: [74, 70],
      DH: [75, 76],
      DI: [77, 76],
      DJ: [78, 77],
      DK: [78, 79],
      DL: [79, 91],
      DM: [80, 79],
      DN: [80, 81],
      DO: [81, 72],
      DP: [81, 82],
      DQ: [82, 83],
      DR: [84, 83],
      DS: [85, 84],
      DT: [86, 85],
      DU: [86, 87],
      DV: [87, 88],
      DW: [89, 74],
      DX: [89, 88],
      DY: [90, 75],
      DZ: [90, 94],
      EA: [92, 83],
      EB: [92, 102],
      EC: [93, 87],
      ED: [93, 106],
      EE: [95, 94],
      EF: [95, 96],
      EG: [97, 96],
      EH: [97, 98],
      EI: [98, 91],
      EJ: [99, 98],
      EK: [99, 100],
      EL: [101, 100],
      EM: [101, 102],
      EN: [102, 103],
      EO: [104, 103],
      EP: [105, 104],
      EQ: [106, 105],
      ER: [107, 106],
      ES: [107, 108],
      ET: [109, 96],
      EU: [110, 100],
      EV: [110, 118],
      EW: [111, 104],
      EX: [112, 108],
      EY: [112, 126],
      EZ: [113, 114],
      FA: [114, 109],
      FB: [114, 115],
      FC: [116, 115],
      FD: [117, 116],
      FE: [117, 118],
      FF: [119, 118],
      FG: [119, 120],
      FH: [120, 121],
      FI: [121, 122],
      FJ: [122, 111],
      FK: [123, 122],
      FL: [124, 123],
      FM: [125, 124],
      FN: [126, 125],
    },
    pos: {
      0: [0, 12],
      1: [1, 12],
      2: [2, 12],
      3: [3, 12],
      4: [4, 12],
      5: [5, 12],
      6: [6, 12],
      7: [7, 12],
      8: [8, 12],
      9: [9, 12],
      10: [10, 12],
      11: [11, 12],
      12: [12, 12],
      13: [13, 12],
      14: [0, 11],
      15: [4, 11],
      16: [8, 11],
      17: [12, 11],
      18: [0, 10],
      19: [1, 10],
      20: [2, 10],
      21: [3, 10],
      22: [4, 10],
      23: [5, 10],
      24: [6, 10],
      25: [7, 10],
      26: [8, 10],
      27: [9, 10],
      28: [10, 10],
      29: [11, 10],
      30: [12, 10],
      31: [13, 10],
      32: [14, 10],
      33: [2, 9],
      34: [6, 9],
      35: [10, 9],
      36: [14, 9],
      37: [0, 8],
      38: [1, 8],
      39: [2, 8],
      40: [3, 8],
      41: [4, 8],
      42: [5, 8],
      43: [6, 8],
      44: [7, 8],
      45: [8, 8],
      46: [9, 8],
      47: [10, 8],
      48: [11, 8],
      49: [12, 8],
      50: [13, 8],
      51: [14, 8],
      52: [0, 7],
      53: [4, 7],
      54: [8, 7],
      55: [12, 7],
      56: [0, 6],
      57: [1, 6],
      58: [2, 6],
      59: [3, 6],
      60: [4, 6],
      61: [5, 6],
      62: [6, 6],
      63: [7, 6],
      64: [8, 6],
      65: [9, 6],
      66: [10, 6],
      67: [11, 6],
      68: [12, 6],
      69: [13, 6],
      70: [14, 6],
      71: [2, 5],
      72: [6, 5],
      73: [10, 5],
      74: [14, 5],
      75: [0, 4],
      76: [1, 4],
      77: [2, 4],
      78: [3, 4],
      79: [4, 4],
      80: [5, 4],
      81: [6, 4],
      82: [7, 4],
      83: [8, 4],
      84: [9, 4],
      85: [10, 4],
      86: [11, 4],
      87: [12, 4],
      88: [13, 4],
      89: [14, 4],
      90: [0, 3],
      91: [4, 3],
      92: [8, 3],
      93: [12, 3],
      94: [1, 2],
      95: [2, 2],
      96: [3, 2],
      97: [4, 2],
      98: [5, 2],
      99: [6, 2],
      100: [7, 2],
      101: [8, 2],
      102: [9, 2],
      103: [10, 2],
      104: [11, 2],
      105: [12, 2],
      106: [13, 2],
      107: [14, 2],
      108: [15, 2],
      109: [3, 1],
      110: [7, 1],
      111: [11, 1],
      112: [15, 1],
      113: [1, 0],
      114: [2, 0],
      115: [3, 0],
      116: [4, 0],
      117: [5, 0],
      118: [6, 0],
      119: [7, 0],
      120: [8, 0],
      121: [9, 0],
      122: [10, 0],
      123: [11, 0],
      124: [12, 0],
      125: [13, 0],
      126: [14, 0],
    },
    sdk: "ManualQISKit",
    description: "IBM Kyiv",
    example: Array.from({ length: 133 }, () => 0.25),
  },
  ibm_torino: {
    num: 133,
    area: [19, 14],
    entangleType: "CZ",
    pairs: {
      AA: [0, 1],
      AB: [0, 15],
      AC: [1, 2],
      AD: [2, 3],
      AE: [3, 4],
      AF: [4, 5],
      AG: [4, 16],
      AH: [5, 6],
      AI: [6, 7],
      AJ: [7, 8],
      AK: [8, 9],
      AL: [8, 17],
      AM: [9, 10],
      AN: [10, 11],
      AO: [11, 12],
      AP: [12, 13],
      AQ: [12, 18],
      AR: [13, 14],
      AS: [15, 19],
      AT: [16, 23],
      AU: [17, 27],
      AV: [18, 31],
      AW: [19, 20],
      AX: [20, 21],
      AY: [21, 22],
      AZ: [21, 34],
      BA: [22, 23],
      BB: [23, 24],
      BC: [24, 25],
      BD: [25, 26],
      BE: [25, 35],
      BF: [26, 27],
      BG: [27, 28],
      BH: [28, 29],
      BI: [29, 30],
      BJ: [29, 36],
      BK: [30, 31],
      BL: [31, 32],
      BM: [32, 33],
      BN: [33, 37],
      BO: [34, 40],
      BP: [35, 44],
      BQ: [36, 48],
      BR: [37, 52],
      BS: [38, 53],
      BT: [39, 40],
      BU: [40, 41],
      BV: [41, 42],
      BW: [42, 43],
      BY: [42, 54],
      BZ: [43, 44],
      CA: [44, 45],
      CB: [45, 46],
      CC: [46, 47],
      CD: [46, 55],
      CE: [47, 48],
      CF: [48, 49],
      CG: [49, 50],
      CH: [50, 51],
      CI: [50, 56],
      CJ: [51, 52],
      CK: [53, 57],
      CL: [54, 61],
      CM: [55, 65],
      CN: [56, 69],
      CO: [57, 58],
      CP: [58, 59],
      CQ: [59, 60],
      CR: [59, 72],
      CS: [60, 61],
      CT: [61, 62],
      CU: [62, 63],
      CV: [63, 64],
      CW: [63, 73],
      CX: [64, 65],
      CY: [65, 66],
      CZ: [66, 67],
      DA: [67, 68],
      DB: [67, 74],
      DC: [68, 69],
      DD: [69, 70],
      DE: [70, 71],
      DF: [71, 75],
      DG: [72, 78],
      DH: [73, 82],
      DI: [74, 86],
      DJ: [75, 90],
      DK: [76, 77],
      DL: [76, 91],
      DM: [77, 78],
      DN: [78, 79],
      DO: [79, 80],
      DP: [80, 81],
      DQ: [80, 92],
      DR: [81, 82],
      DS: [82, 83],
      DT: [83, 84],
      DU: [84, 85],
      DV: [84, 93],
      DW: [85, 86],
      DX: [86, 87],
      DY: [87, 88],
      DZ: [88, 89],
      EA: [88, 94],
      EB: [89, 90],
      EC: [91, 95],
      ED: [92, 99],
      EE: [93, 103],
      EF: [94, 107],
      EG: [95, 96],
      EH: [96, 97],
      EI: [97, 98],
      EJ: [97, 110],
      EK: [98, 99],
      EL: [99, 100],
      EM: [100, 101],
      EN: [101, 102],
      EO: [101, 111],
      EP: [102, 103],
      EQ: [103, 104],
      ER: [104, 105],
      ES: [105, 106],
      ET: [105, 112],
      EU: [106, 107],
      EV: [107, 108],
      EW: [108, 109],
      EX: [109, 113],
      EY: [110, 116],
      EZ: [111, 120],
      FA: [112, 124],
      FB: [113, 128],
      FC: [114, 115],
      FD: [114, 129],
      FE: [115, 116],
      FF: [116, 117],
      FG: [117, 118],
      FH: [118, 119],
      FI: [118, 130],
      FJ: [119, 120],
      FK: [120, 121],
      FL: [121, 122],
      FM: [122, 123],
      FN: [122, 131],
      FO: [123, 124],
      FP: [124, 125],
      FQ: [125, 126],
      FR: [126, 127],
      FS: [126, 132],
      FT: [127, 128],
    },
    pos: {
      0: [0, 13],
      1: [1, 13],
      2: [2, 13],
      3: [3, 13],
      4: [4, 13],
      5: [5, 13],
      6: [6, 13],
      7: [7, 13],
      8: [8, 13],
      9: [9, 13],
      10: [10, 13],
      11: [11, 13],
      12: [12, 13],
      13: [13, 13],
      14: [14, 13],
      15: [0, 12],
      16: [4, 12],
      17: [8, 12],
      18: [12, 12],
      19: [1, 11],
      20: [2, 11],
      21: [3, 11],
      22: [4, 11],
      23: [5, 11],
      24: [6, 11],
      25: [7, 11],
      26: [8, 11],
      27: [9, 11],
      28: [10, 11],
      29: [11, 11],
      30: [12, 11],
      31: [13, 11],
      32: [14, 11],
      33: [15, 11],
      34: [3, 10],
      35: [7, 10],
      36: [11, 10],
      37: [15, 10],
      38: [0, 9],
      39: [1, 9],
      40: [2, 9],
      41: [3, 9],
      42: [4, 9],
      43: [5, 9],
      44: [6, 9],
      45: [7, 9],
      46: [8, 9],
      47: [9, 9],
      48: [10, 9],
      49: [11, 9],
      50: [12, 9],
      51: [13, 9],
      52: [14, 9],
      53: [0, 8],
      54: [4, 8],
      55: [8, 8],
      56: [12, 8],
      57: [1, 7],
      58: [2, 7],
      59: [3, 7],
      60: [4, 7],
      61: [5, 7],
      62: [6, 7],
      63: [7, 7],
      64: [8, 7],
      65: [9, 7],
      66: [10, 7],
      67: [11, 7],
      68: [12, 7],
      69: [13, 7],
      70: [14, 7],
      71: [15, 7],
      72: [3, 6],
      73: [7, 6],
      74: [11, 6],
      75: [15, 6],
      76: [0, 5],
      77: [1, 5],
      78: [2, 5],
      79: [3, 5],
      80: [4, 5],
      81: [5, 5],
      82: [6, 5],
      83: [7, 5],
      84: [8, 5],
      85: [9, 5],
      86: [10, 5],
      87: [11, 5],
      88: [12, 5],
      89: [13, 5],
      90: [14, 5],
      91: [0, 4],
      92: [4, 4],
      93: [8, 4],
      94: [12, 4],
      95: [1, 3],
      96: [2, 3],
      97: [3, 3],
      98: [4, 3],
      99: [5, 3],
      100: [6, 3],
      101: [7, 3],
      102: [8, 3],
      103: [9, 3],
      104: [10, 3],
      105: [11, 3],
      106: [12, 3],
      107: [13, 3],
      108: [14, 3],
      109: [15, 3],
      110: [3, 2],
      111: [7, 2],
      112: [11, 2],
      113: [15, 2],
      114: [0, 1],
      115: [1, 1],
      116: [2, 1],
      117: [3, 1],
      118: [4, 1],
      119: [5, 1],
      120: [6, 1],
      121: [7, 1],
      122: [8, 1],
      123: [9, 1],
      124: [10, 1],
      125: [11, 1],
      126: [12, 1],
      127: [13, 1],
      128: [14, 1],
      129: [0, 0],
      130: [4, 0],
      131: [8, 0],
      132: [12, 0],
    },
    sdk: "ManualQISKit",
    description: "IBM Torino",
    example: Array.from({ length: 133 }, () => 0.25),
  },
  ibm_fez: {
    num: 156,
    area: [16, 16],
    entangleType: "CZ",
    pairs: {
      AA: [0, 1], AB: [1, 2], AC: [2, 3], AD: [3, 4], AE: [3, 16], AF: [4, 5], AG: [5, 6], AH: [6, 7], AI: [7, 8], AJ: [7, 17], AK: [8, 9], AL: [9, 10], AM: [10, 11], AN: [11, 12], AO: [11, 18], AP: [12, 13], AQ: [13, 14], AR: [14, 15], AS: [15, 19], AT: [16, 23], AU: [17, 27], AV: [18, 31], AW: [19, 35], AX: [20, 21], AY: [21, 22], AZ: [21, 36], BA: [22, 23], BB: [23, 24], BC: [24, 25], BD: [25, 26], BE: [25, 37], BF: [26, 27], BG: [27, 28], BH: [28, 29], BI: [29, 30], BJ: [29, 38], BK: [30, 31], BL: [31, 32], BM: [32, 33], BN: [33, 34], BO: [33, 39], BP: [34, 35], BQ: [36, 41], BR: [37, 45], BS: [38, 49], BT: [39, 53], BU: [40, 41], BV: [41, 42], BW: [42, 43], BX: [43, 44], BY: [43, 56], BZ: [44, 45], CA: [45, 46], CB: [46, 47], CC: [47, 48], CD: [47, 57], CE: [48, 49], CF: [49, 50], CG: [50, 51], CH: [51, 52], CI: [51, 58], CJ: [52, 53], CK: [53, 54], CL: [54, 55], CM: [55, 59], CN: [56, 63], CO: [57, 67], CP: [58, 71], CQ: [59, 75], CR: [60, 61], CS: [61, 62], CT: [61, 76], CU: [62, 63], CV: [63, 64], CW: [64, 65], CX: [65, 66], CY: [65, 77], CZ: [66, 67], DA: [67, 68], DB: [68, 69], DC: [69, 70], DD: [69, 78], DE: [70, 71], DF: [71, 72], DG: [72, 73], DH: [73, 74], DI: [73, 79], DJ: [74, 75], DK: [76, 81], DL: [77, 85], DM: [78, 89], DN: [79, 93], DO: [80, 81], DP: [81, 82], DQ: [82, 83], DR: [83, 84], DS: [83, 96], DT: [84, 85], DU: [85, 86], DV: [86, 87], DW: [87, 88], DX: [87, 97], DY: [88, 89], DZ: [89, 90], EA: [90, 91], EB: [91, 92], EC: [91, 98], ED: [92, 93], EE: [93, 94], EF: [94, 95], EG: [95, 99], EH: [96, 103], EI: [97, 107], EJ: [98, 111], EK: [99, 115], EL: [100, 101], EM: [101, 102], EN: [101, 116], EO: [102, 103], EP: [103, 104], EQ: [104, 105], ER: [105, 106], ES: [105, 117], ET: [106, 107], EU: [107, 108], EV: [108, 109], EW: [109, 110], EX: [109, 118], EY: [110, 111], EZ: [111, 112], FA: [112, 113], FB: [113, 114], FC: [113, 119], FD: [114, 115], FE: [116, 121], FF: [117, 125], FG: [118, 129], FH: [119, 133], FI: [120, 121], FJ: [121, 122], FK: [122, 123], FL: [123, 124], FM: [123, 136], FN: [124, 125], FO: [125, 126], FP: [126, 127], FQ: [127, 128], FR: [127, 137], FS: [128, 129], FT: [129, 130], FU: [130, 131], FV: [131, 132], FW: [131, 138], FX: [132, 133], FY: [133, 134], FZ: [134, 135], GA: [135, 139], GB: [136, 143], GC: [137, 147], GD: [138, 151], GE: [139, 155], GF: [140, 141], GG: [141, 142], GH: [142, 143], GI: [143, 144], GJ: [144, 145], GK: [145, 146], GL: [146, 147], GM: [147, 148], GN: [148, 149], GO: [149, 150], GP: [150, 151], GQ: [151, 152], GR: [152, 153], GS: [153, 154], GT: [154, 155]
    },
    pos: {
      0: [0, 0], 1: [1, 0], 2: [2, 0], 3: [3, 0], 4: [4, 0], 5: [5, 0], 6: [6, 0], 7: [7, 0], 8: [8, 0], 9: [9, 0], 10: [10, 0], 11: [11, 0], 12: [12, 0], 13: [13, 0], 14: [14, 0], 15: [15, 0], 16: [3, 1], 17: [7, 1], 18: [11, 1], 19: [15, 1], 20: [0, 2], 21: [1, 2], 22: [2, 2], 23: [3, 2], 24: [4, 2], 25: [5, 2], 26: [6, 2], 27: [7, 2], 28: [8, 2], 29: [9, 2], 30: [10, 2], 31: [11, 2], 32: [12, 2], 33: [13, 2], 34: [14, 2], 35: [15, 2], 36: [1, 3], 37: [5, 3], 38: [9, 3], 39: [13, 3], 40: [0, 4], 41: [1, 4], 42: [2, 4], 43: [3, 4], 44: [4, 4], 45: [5, 4], 46: [6, 4], 47: [7, 4], 48: [8, 4], 49: [9, 4], 50: [10, 4], 51: [11, 4], 52: [12, 4], 53: [13, 4], 54: [14, 4], 55: [15, 4], 56: [3, 5], 57: [7, 5], 58: [11, 5], 59: [15, 5], 60: [0, 6], 61: [1, 6], 62: [2, 6], 63: [3, 6], 64: [4, 6], 65: [5, 6], 66: [6, 6], 67: [7, 6], 68: [8, 6], 69: [9, 6], 70: [10, 6], 71: [11, 6], 72: [12, 6], 73: [13, 6], 74: [14, 6], 75: [15, 6], 76: [1, 7], 77: [5, 7], 78: [9, 7], 79: [13, 7], 80: [0, 8], 81: [1, 8], 82: [2, 8], 83: [3, 8], 84: [4, 8], 85: [5, 8], 86: [6, 8], 87: [7, 8], 88: [8, 8], 89: [9, 8], 90: [10, 8], 91: [11, 8], 92: [12, 8], 93: [13, 8], 94: [14, 8], 95: [15, 8], 96: [3, 9], 97: [7, 9], 98: [11, 9], 99: [15, 9], 100: [0, 10], 101: [1, 10], 102: [2, 10], 103: [3, 10], 104: [4, 10], 105: [5, 10], 106: [6, 10], 107: [7, 10], 108: [8, 10], 109: [9, 10], 110: [10, 10], 111: [11, 10], 112: [12, 10], 113: [13, 10], 114: [14, 10], 115: [15, 10], 116: [1, 11], 117: [5, 11], 118: [9, 11], 119: [13, 11], 120: [0, 12], 121: [1, 12], 122: [2, 12], 123: [3, 12], 124: [4, 12], 125: [5, 12], 126: [6, 12], 127: [7, 12], 128: [8, 12], 129: [9, 12], 130: [10, 12], 131: [11, 12], 132: [12, 12], 133: [13, 12], 134: [14, 12], 135: [15, 12], 136: [3, 13], 137: [7, 13], 138: [11, 13], 139: [15, 13], 140: [0, 14], 141: [1, 14], 142: [2, 14], 143: [3, 14], 144: [4, 14], 145: [5, 14], 146: [6, 14], 147: [7, 14], 148: [8, 14], 149: [9, 14], 150: [10, 14], 151: [11, 14], 152: [12, 14], 153: [13, 14], 154: [14, 14], 155: [15, 14]
    },
    sdk: "ManualQISKit",
    description: "IBM Fez",
    example: Array.from({ length: 156 }, () => 0.25),
  },
}

export default function QuantumCouplingVisualizer() {
  const [selectedDevice, setSelectedDevice] = useState("ibmqx4")
  const [gameManager] = useState(() => new GameManager())
  const [gameState, setGameState] = useState(gameManager.getState())
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [gameHistory, setGameHistory] = useState<
    Array<{
      device: string
      rounds: number
      totalScore: number
      accuracy: number
      timestamp: Date
    }>
  >([])

  const [useRealHardware, setUseRealHardware] = useState(false)
  const [dataAvailable, setDataAvailable] = useState<{
    realData: boolean
    simulatedData: boolean
    availableFiles: DataFileInfo[]
  }>({
    realData: false,
    simulatedData: false,
    availableFiles: [],
  })

  const [selectedDataFile, setSelectedDataFile] = useState<DataFileInfo | null>(null)

  const device = useMemo(() => {
    const config = deviceData[selectedDevice as keyof typeof deviceData]
    return new QuantumDevice(config)
  }, [selectedDevice])

  const simulator = useMemo(() => new HardwareQuantumSimulator(device), [device])

  useEffect(() => {
    const checkDataAvailability = async () => {
      const availability = await HardwareQuantumSimulator.getDeviceDataInfo(device.name)
      setDataAvailable({
        realData: availability.realData,
        simulatedData: availability.simulatedData,
        availableFiles: availability.availableFiles || [],
      })

      if (availability.availableFiles && availability.availableFiles.length > 0) {
        setSelectedDataFile(availability.availableFiles[0])
      }
    }

    checkDataAvailability()
  }, [device.name])

  const handleStartGame = async () => {
    const initialized = await simulator.initialize(useRealHardware, selectedDataFile || undefined)
    if (!initialized && useRealHardware) {
      setUseRealHardware(false)
      await simulator.initialize(false)
    }

    const puzzle = simulator.generateNewPuzzle()
    // --- MODIFIED: Pass the selected file's type to the game manager ---
    gameManager.startGame(puzzle, selectedDataFile?.fileType)
    setGameState(gameManager.getState())
  }

  const handleMakeGuess = (pairName: string) => {
    const result = gameManager.makeGuess(pairName)
    setGameState(gameManager.getState())

    // Check if the entire game is complete after the round ends
    if (result.roundComplete && result.roundResult?.isGameComplete) {
      handleGameComplete(gameManager.getState())
    }
  }

  const handleNextRound = () => {
    const puzzle = simulator.generateNewPuzzle()
    const canContinue = gameManager.nextRound(puzzle)
    if (canContinue) {
      setGameState(gameManager.getState())
    }
  }

  const handleCheat = () => {
    const result = gameManager.revealSolution()
    setGameState(gameManager.getState())

    if (result.roundComplete && result.roundResult?.isGameComplete) {
      handleGameComplete(gameManager.getState())
    }
  }

  const handleResetGame = () => {
    gameManager.resetGame()
    setGameState(gameManager.getState())
  }

  const handleGameComplete = (finalState: any) => {
    const accuracy = (finalState.totalScore / (finalState.roundScores.length * finalState.targetPairs)) * 100
    const newRecord = {
      device: device.name,
      rounds: finalState.roundScores.length,
      totalScore: finalState.totalScore,
      accuracy: accuracy,
      timestamp: new Date(),
    }
    setGameHistory((prev) => [...prev, newRecord])
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3.0))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.3))
  }

  const handleResetZoom = () => {
    setZoomLevel(1.0)
  }

  const handleDeselectPair = (pairName: string) => {
    const result = gameManager.deselectPair(pairName)
    setGameState(gameManager.getState())
  }

  const renderQuantumVisualization = () => {
    const positions = Object.values(device.positions)
    const minX = Math.min(...positions.map((pos) => pos[0]))
    const maxXActual = Math.max(...positions.map((pos) => pos[0]))
    const minY = Math.min(...positions.map((pos) => pos[1]))
    const maxYActual = Math.max(...positions.map((pos) => pos[1]))

    const deviceWidth = maxXActual - minX
    const deviceHeight = maxYActual - minY
    const deviceSize = Math.max(deviceWidth, deviceHeight)

    let baseScale = 60
    if (deviceSize < 3) {
      baseScale = 120
    } else if (deviceSize < 8) {
      baseScale = 80
    }

    const scale = baseScale * zoomLevel
    const padding = 80

    const contentWidth = deviceWidth * scale + padding * 2
    const contentHeight = deviceHeight * scale + padding * 2

    const maxContainerWidth = 1200
    const maxContainerHeight = 800

    const containerWidth = Math.min(maxContainerWidth, Math.max(800, contentWidth))
    const containerHeight = Math.min(maxContainerHeight, Math.max(600, contentHeight))

    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Button onClick={handleZoomOut} variant="outline" size="sm" disabled={zoomLevel <= 0.3}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={handleResetZoom} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={handleZoomIn} variant="outline" size="sm" disabled={zoomLevel >= 3.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[60px]">{Math.round(zoomLevel * 100)}%</span>
        </div>

        <div
          className="border rounded-lg bg-white overflow-auto"
          style={{
            width: containerWidth,
            height: containerHeight,
            maxWidth: maxContainerWidth,
            maxHeight: maxContainerHeight,
          }}
        >
          <svg width={contentWidth} height={contentHeight} className="block">
            {Object.entries(device.pairs).map(([pairName, [q1, q2]]) => {
              const pos1 = device.getPosition(q1)
              const pos2 = device.getPosition(q2)

              if (!pos1 || !pos2) return null

              /*
              const x1 = (pos1[0] - minX) * scale + padding
              const y1 = (maxYActual - pos1[1]) * scale + padding
              const x2 = (pos2[0] - minX) * scale + padding
              const y2 = (maxYActual - pos2[1]) * scale + padding
              */

              const x1 = (pos1[0] - minX) * scale + padding
              const y1 = (pos1[1] - minY) * scale + padding
              const x2 = (pos2[0] - minX) * scale + padding
              const y2 = (pos2[1] - minY) * scale + padding

              const isPairGuessed = gameState.guessedPairs.includes(pairName)
              const isPairCorrect = gameState.algorithmSolution.includes(pairName)

              let strokeColor = "#6b7280"
              let strokeWidth = "2"

              if (gameState.dataType === 'sameProbs' && gameState.isGameActive) {
                // console.log("==================Hello==================");
                const similarity = gameState.pairSimilarities[pairName] || 0
                const invertedSimilarity = 1 - similarity
                // Using an exponential scale for more dramatic thickness
                strokeWidth = `${Math.max(1.5, 12 * Math.pow(similarity, 2))}`
                // new data: invertedSimilarity, old data: similarity???? => Fixed because it was using abs.

                // console.log("StrokeWidth: ", strokeWidth, "similarity: ", invertedSimilarity, pairName)
              } else {
                strokeWidth = "4"
              }

              if (gameState.isGameActive && isPairGuessed) {
                strokeColor = isPairCorrect ? "#10b981" : "#ef4444"
                strokeWidth = `${parseFloat(strokeWidth) + 2}`
              }

              return (
                <g key={pairName}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className={gameState.isGameActive ? "cursor-pointer hover:stroke-blue-500" : ""}
                    onClick={() => {
                      if (gameState.isGameActive && !gameState.roundComplete) {
                        if (isPairGuessed) {
                          handleDeselectPair(pairName)
                        } else {
                          handleMakeGuess(pairName)
                        }
                      }
                    }}
                  />
                </g>
              )
            })}

            {Array.from({ length: device.qubitCount }, (_, i) => i).map((qubitId) => {
              const pos = device.getPosition(qubitId)
              if (!pos) return null

              /*
              const x = (pos[0] - minX) * scale + padding
              const y = (maxYActual - pos[1]) * scale + padding
              */

              const x = (pos[0] - minX) * scale + padding
              const y = (maxYActual - pos[1]) * scale + padding
              
              let qubitFillColor = "#9ca3af";

              if (gameState.dataType === 'oneProbs' && gameState.isGameActive && gameState.oneProb.length > 0) {
                const qubitValue = gameState.oneProb[qubitId];
                const qubitColour = qubitValue !== null ? Math.max(0, Math.min(1, qubitValue)) : 0;
                
                const R = Math.round(239 + (59 - 239) * qubitColour);
                const B = Math.round(68 + (246 - 68) * qubitColour);
                const G = Math.round(68 + (130 - 68) * qubitColour);
                qubitFillColor = `rgb(${R},${G},${B})`;
              } else if (gameState.dataType === 'oneProbs') {
                const qubitValue = device.getQubitValue(qubitId);
                const qubitColour = qubitValue !== null ? Math.max(0, Math.min(1, qubitValue)) : 0;
                const R = Math.round(239 + (59 - 239) * qubitColour);
                const B = Math.round(68 + (246 - 68) * qubitColour);
                const G = Math.round(68 + (130 - 68) * qubitColour);
                qubitFillColor = `rgb(${R},${G},${B})`;
              }
        
              return (
                <g key={qubitId}>
                  <circle cx={x} cy={y} r="18" fill={qubitFillColor} />
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  const handleDeviceChange = (newDevice: string) => {
    setSelectedDevice(newDevice)
    gameManager.resetGame()
    setGameState(gameManager.getState())
    setSelectedDataFile(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-6 w-6" />
              Quantum Awesomeness - Benchmarking quantum computers with puzzle game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedDevice} onValueChange={handleDeviceChange}>
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(deviceData).map(([key, device]) => (
                          <SelectItem key={key} value={key}>
                            {device.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {device.qubitCount} Qubits
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {Object.keys(device.pairs).length} Connections
                    </Badge>
                  </div>

                  {gameHistory.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Game Records</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {gameHistory
                          .slice(-5)
                          .reverse()
                          .map((record, index) => (
                            <div key={index} className="text-sm flex justify-between items-center">
                              <span className="font-medium">{record.device}</span>
                              <span>
                                {record.totalScore} pts ({record.accuracy.toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Data Source:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="simulated"
                          name="dataSource"
                          checked={!useRealHardware}
                          onChange={() => setUseRealHardware(false)}
                          className="mr-1"
                        />
                        <label htmlFor="simulated" className="text-sm">
                          Simulated
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="hardware"
                          name="dataSource"
                          checked={useRealHardware}
                          onChange={() => setUseRealHardware(true)}
                          disabled={!dataAvailable.realData && dataAvailable.availableFiles.length === 0}
                          className="mr-1"
                        />
                        <label
                          htmlFor="hardware"
                          className={`text-sm ${!dataAvailable.realData && dataAvailable.availableFiles.length === 0 ? "text-gray-400" : ""}`}
                        >
                          Real Hardware{" "}
                          {!dataAvailable.realData && dataAvailable.availableFiles.length === 0 && "(Not Available)"}
                        </label>
                      </div>
                    </div>

                    {dataAvailable.availableFiles.length > 0 && useRealHardware && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="font-medium flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            Available Data:
                          </span>
                        </div>
                        <Select
                          value={selectedDataFile?.displayName || ""}
                          onValueChange={(value) => {
                            const file = dataAvailable.availableFiles.find((f) => f.displayName === value)
                            setSelectedDataFile(file || null)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select data file" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataAvailable.availableFiles.map((file, index) => (
                              <SelectItem key={index} value={file.displayName}>
                                {file.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedDataFile && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Using: {selectedDataFile.displayName}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {!gameState.isGameActive ? (
                      <div className="text-center space-y-4">
                        <p className="text-gray-600">
                          Find the entangled qubit pairs! Click on the edges to make your guesses.
                        </p>
                        <p className="text-sm text-gray-500">
                          Qubits with similar values are likely to have similar colours.
                        </p>
                        <Button onClick={handleStartGame} className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Start Game
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 p-4 bg-white rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Round {gameState.round}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* --- NEW: Cheat Button --- */}
                            <Button onClick={handleCheat} variant="destructive" size="sm" disabled={gameState.roundComplete}>
                              Cheat
                            </Button>
                            <Button onClick={handleResetGame} variant="outline" size="sm">
                              Reset Game
                            </Button>
                          </div>
                        </div>

                        {gameState.roundComplete ? (
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-bold text-lg">Round Complete!</h3>
                            {gameState.round < gameState.maxRounds ? (
                              <Button onClick={handleNextRound} className="mt-2">
                                Next Round
                              </Button>
                            ) : (
                              <p className="text-sm mt-2">Game Over! Thanks for playing.</p>
                            )}
                          </div>
                        ) : (
                           <div className="text-sm text-gray-600">
                             <p>
                               <strong>Instructions:</strong> Click on the edges to make your guesses.
                             </p>
                             <p>Paired qubits should have similar colours.</p>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Device Layout</h3>
                {!gameState.isGameActive && (
                    <Badge variant="outline">Example</Badge>
                )}

                {renderQuantumVisualization()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
