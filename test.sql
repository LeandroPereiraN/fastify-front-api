SELECT DISTINCT f.pizzeria
FROM PERSONA p
JOIN FRECUENTA f 
  ON p.nombre = f.nombre
WHERE p.edad < 18;

SELECT DISTINCT p.nombre
FROM PERSONA p
JOIN COME c 
  ON p.nombre = c.nombre
WHERE p.género = 'F'
  AND (c.pizza = 'hongos' OR c.pizza = 'pepperoni');

SELECT p.nombre
FROM PERSONA p
JOIN COME c ON p.nombre = c.nombre
WHERE p.genero = 'F'
  AND c.pizza IN ('hongos', 'pepperoni')
GROUP BY p.nombre
HAVING COUNT(DISTINCT c.pizza) = 2;

SELECT DISTINCT m.pizzeria
FROM MENU m
JOIN COME c 
  ON m.pizza = c.pizza
WHERE c.nombre = 'Amy' 
  AND m.precio < 10;

SELECT f.pizzeria
FROM FRECUENTA f
JOIN PERSONA p 
  ON f.nombre = p.nombre
GROUP BY f.pizzeria
HAVING COUNT(DISTINCT p.genero) = 1
   AND MIN(p.genero) = 'F';

SELECT c.nombre, c.pizza
FROM COME c
WHERE NOT EXISTS (
  SELECT 1
  FROM FRECUENTA f
  JOIN MENU m 
    ON f.pizzeria = m.pizzeria
  WHERE f.nombre = c.nombre 
  AND m.pizza = c.pizza
);

SELECT DISTINCT f.nombre
FROM FRECUENTA f
WHERE NOT EXISTS (
  SELECT 1
  FROM FRECUENTA f2
  WHERE f2.nombre = f.nombre
    AND NOT EXISTS (
      SELECT 1
      FROM MENU m
      JOIN COME c ON m.pizza = c.pizza AND c.nombre = f.nombre
      WHERE m.pizzeria = f2.pizzeria
    )
);

SELECT pizzeria, precio
FROM MENU
WHERE pizza = 'pepperoni'
  AND precio = (SELECT MIN(precio) FROM MENU WHERE pizza = 'pepperoni');


SELECT DISTINCT f.nombre
FROM FRECUENTA f 
WHERE NOT EXISTS (
  SELECT 1 
  FROM FRECUENTA f2 
  WHERE f2.nombre = f.nombre 
    AND NOT EXISTS (
      SELECT 1 FROM MENU m 
      JOIN COME c 
        ON m.pizza=c.pizza 
      WHERE c.nombre=f.nombre 
        AND m.pizzeria=f2.pizzeria
    )
);


SELECT DISTINCT p.nombre
FROM PERSONA p
WHERE NOT EXISTS (
  SELECT 1
  FROM (
    SELECT DISTINCT m.pizzeria
    FROM MENU m
    JOIN COME c ON m.pizza = c.pizza
    WHERE c.nombre = p.nombre
  ) sub
  WHERE NOT EXISTS (
    SELECT 1
    FROM FRECUENTA f
    WHERE f.nombre = p.nombre
      AND f.pizzeria = sub.pizzeria
  )
);