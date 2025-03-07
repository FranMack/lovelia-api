const table1 = [
    { 87: [2039, 1987, 1935] },
    { 242: [2038, 1986, 1934] },
    { 137: [2037, 1985, 1933] },
    { 32: [2036, 1984, 1932] },
    { 187: [2035, 1983, 1931] },
    { 82: [2034, 1982, 1930] },
    { 237: [2033, 1981, 1929] },
    { 132: [2032, 1980, 1928] },
    { 27: [2031, 1979, 1927] },
    { 182: [2030, 1978, 1926] },
    { 77: [2029, 1977, 1925] },
    { 232: [2028, 1976, 1924] },
    { 127: [2027, 1975, 1923] },
    { 22: [2026, 1974, 1922] },
    { 177: [2025, 1973, 1921] },
    { 72: [2024, 1972, 1920] },
    { 227: [2023, 1971, 1919] },
    { 122: [2022, 1970, 1918] },
    { 17: [2021, 1969, 1917] },
    { 172: [2020, 1968, 1916] },
    { 67: [2019, 1967, 1915] },
    { 222: [2018, 1966, 1914] },
    { 117: [2017, 1965, 1913] },
    { 12: [2016, 1964, 1912] },
    { 167: [2015, 1963, 1911] },
    { 62: [2014, 1962, 1910] },
    { 217: [2013, 1961, 1909] },
    { 112: [2012, 1960, 1908] },
    { 7: [2011, 1959, 1907] },
    { 162: [2010, 1958, 1906] },
    { 57: [2009, 1957, 1905] },
    { 212: [2008, 1956, 1904] },
    { 107: [2007, 1955, 1903] },
    { 2: [2006, 1954, 1902] },
    { 157: [2005, 1953, 1901] },
    { 52: [2004, 1952, 1900] },
    { 207: [2003, 1951, 1899] },
    { 102: [2002, 1950, 1898] },
    { 257: [2001, 1949, 1897] },
    { 152: [2000, 1948, 1896] },
    { 47: [1999, 1947, 1895] },
    { 202: [1998, 1946, 1894] },
    { 97: [1997, 1945, 1893] },
    { 252: [1996, 1944, 1892] },
    { 147: [1995, 1943, 1891] },
    { 42: [1994, 1942, 1890] },
    { 197: [1993, 1941, 1889] },
    { 92: [1992, 1940, 1888] },
    { 247: [1991, 1939, 1887] },
    { 142: [1990, 1938, 1886] },
    { 37: [1989, 1937, 1885] },
    { 192: [1988, 1936, 1884] },
  ];
  
  const table2 = {
    1: 0,
    2: 31,
    3: 59,
    4: 90,
    5: 120,
    6: 151,
    7: 181,
    8: 212,
    9: 243,
    10: 13,
    11: 44,
    12: 74,
  };
  
  const kinMayaTable = [
    {
      dragon: [1, 21, 41, 61, 81, 101, 121, 141, 161, 181, 201, 221, 241],
    },
    {
      wind: [2, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242],
    },
    {
      night: [3, 23, 43, 63, 83, 103, 123, 143, 163, 183, 203, 223, 243],
    },
    {
      seed: [4, 24, 44, 64, 84, 104, 124, 144, 164, 184, 204, 224, 244],
    },
    {
      snake: [5, 25, 45, 65, 85, 105, 125, 145, 165, 185, 205, 225, 245],
    },
    {
      worldBridger: [6, 26, 46, 66, 86, 106, 126, 146, 166, 186, 206, 226, 246],
    },
    {
      hand: [7, 27, 47, 67, 87, 107, 127, 147, 167, 187, 207, 227, 247],
    },
    {
      start: [8, 28, 48, 68, 88, 108, 128, 148, 168, 188, 208, 228, 248],
    },
    {
      moon: [9, 29, 49, 69, 89, 109, 129, 149, 169, 189, 209, 229, 249],
    },
    {
      dog: [10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250],
    },
    {
      monkey: [11, 31, 51, 71, 91, 111, 131, 151, 171, 191, 211, 231, 251],
    },
    {
      human: [12, 32, 52, 72, 92, 112, 132, 152, 172, 192, 212, 232, 252],
    },
    {
      skyWalker: [13, 33, 53, 73, 93, 113, 133, 153, 173, 193, 213, 233, 253],
    },
    {
      wizard: [14, 34, 54, 74, 94, 114, 134, 154, 174, 194, 214, 234, 254],
    },
    {
      eagle: [15, 35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255],
    },
    {
      warrior: [16, 36, 56, 76, 96, 116, 136, 156, 176, 196, 216, 236, 256],
    },
    {
      earth: [17, 37, 57, 77, 97, 117, 137, 157, 177, 197, 217, 237, 257],
    },
    {
      mirrow: [18, 38, 58, 78, 98, 118, 138, 158, 178, 198, 218, 238, 258],
    },
    {
      storm: [19, 39, 59, 79, 99, 119, 139, 159, 179, 199, 219, 239, 259],
    },
    {
      sun: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260],
    },
  ];

  module.exports={table1,table2,kinMayaTable}