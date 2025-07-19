-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-07-2025 a las 08:21:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `webvet`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caso_clinico`
--

CREATE TABLE `caso_clinico` (
  `caso_clinico_id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `mascota_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caso_clinico`
--

INSERT INTO `caso_clinico` (`caso_clinico_id`, `descripcion`, `mascota_id`) VALUES
(1, 'Vacunación anual y control general', 1),
(2, 'Seguimiento post-tratamiento dermatológico', 1),
(3, 'Diagnóstico por pérdida de apetito', 2),
(4, 'Control tras vacunación múltiple', 2),
(5, 'Vacunación anual y control general', 5),
(6, 'Tratamiento dermatológico', 5),
(7, 'Diagnóstico de pérdida de apetito', 5),
(8, 'Consulta por dolor articular', 5),
(9, 'Revisión de salud general', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `cita_id` bigint(20) NOT NULL,
  `estado_cita` enum('COMPLETADA','CONVETERINARIO','PENDIENTE','TRIAJE') NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `motivo` varchar(500) DEFAULT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `mascota_id` bigint(20) NOT NULL,
  `tipo_servicio` bigint(20) NOT NULL,
  `veterinario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`cita_id`, `estado_cita`, `fecha_registro`, `motivo`, `cliente_id`, `mascota_id`, `tipo_servicio`, `veterinario_id`) VALUES
(1, 'COMPLETADA', '2025-07-11 10:00:00.000000', 'Vacuna anual', 1, 1, 2, 1),
(2, 'TRIAJE', '2025-07-11 09:00:00.000000', 'Revisión general', 2, 2, 1, 2),
(3, 'PENDIENTE', '2025-07-15 11:00:00.000000', 'Revisión post vacuna', 1, 1, 1, 1),
(4, 'PENDIENTE', '2025-07-11 15:30:00.000000', 'Consulta por alergia', 2, 2, 1, 2),
(5, 'PENDIENTE', '2025-07-12 09:00:00.000000', 'Consulta por caída de pelo', 1, 1, 1, 2),
(6, 'PENDIENTE', '2025-07-12 14:00:00.000000', 'Revisión por pérdida de apetito', 2, 2, 1, 1),
(7, 'PENDIENTE', '2025-07-14 23:22:31.000000', 'Limpieza', 5, 1, 8, 1),
(8, 'PENDIENTE', '2025-07-16 23:59:08.000000', 'Estética en cabello', 5, 5, 7, 1),
(9, 'COMPLETADA', '2025-07-10 10:00:00.000000', 'Vacunación anual', 3, 5, 2, 2),
(10, 'TRIAJE', '2025-07-18 11:00:00.000000', 'Diagnóstico por pérdida de apetito', 3, 5, 2, 1),
(11, 'PENDIENTE', '2025-07-15 09:00:00.000000', 'Seguimiento post-tratamiento dermatológico', 3, 5, 2, 3),
(12, 'PENDIENTE', '2025-07-18 02:05:48.000000', 'vacuna para la rabia', 5, 1, 2, 2),
(13, 'TRIAJE', '2025-07-18 04:14:28.000000', 'Desparacitacion', 6, 6, 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `cliente_id` bigint(20) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`cliente_id`, `apellido`, `ciudad`, `direccion`, `email`, `nombre`, `telefono`) VALUES
(1, 'Gómez', 'Lima', 'Av. Siempre Viva 123', 'laura.gomez@mail.com', 'Laura', '987654321'),
(2, 'Pérez', 'Arequipa', 'Calle Sol 456', 'carlos.perez@mail.com', 'Carlos', '923456789'),
(3, 'Takamura Rojas', 'Otro', 'Avenida Central', 'isaactakamura1503@hotmail.com', 'Isaac Ivanov', '942029405'),
(4, 'Takamura Rojas', 'Otro', 'Avenida Central', 'isaactakamura1503@hotmail.com', 'Isaac Ivanov', '942029405'),
(5, 'Takamura', 'Otro', 'Avenida Central', 'isaactakamura1503@hotmail.com', 'Isaac', '942029405'),
(6, 'Quiroz', 'Nuevo Chimbote', 'Santa Esperanza', 'axel4512@hotmail.com', 'Axel', '942888555');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especies`
--

CREATE TABLE `especies` (
  `especie_id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especies`
--

INSERT INTO `especies` (`especie_id`, `nombre`) VALUES
(1, 'Canino'),
(2, 'Felino'),
(3, 'Ave'),
(4, 'Reptil'),
(5, 'Roedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `mascota_id` bigint(20) NOT NULL,
  `edad` int(11) NOT NULL,
  `estado` enum('FALLECIDO','VIVO') DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `raza_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`mascota_id`, `edad`, `estado`, `nombre`, `cliente_id`, `raza_id`) VALUES
(1, 4, 'VIVO', 'Max', 1, 1),
(2, 3, 'VIVO', 'Misha', 2, 2),
(3, 2, 'VIVO', 'Thomas', 3, 4),
(4, 2, 'VIVO', 'Thomas2', 4, 4),
(5, 2, 'VIVO', 'Thomas3', 5, 4),
(6, 4, 'VIVO', 'Nieves', 6, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_personal`
--

CREATE TABLE `perfil_personal` (
  `perfil_id` bigint(20) NOT NULL,
  `alergias` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `telefono_emergencia` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil_personal`
--

INSERT INTO `perfil_personal` (`perfil_id`, `alergias`, `apellidos`, `direccion`, `nombres`, `telefono_emergencia`, `usuario_id`) VALUES
(1, 'paracetamol', 'Takamura Rojas', 'Avenida Central', 'Isaac Ivanov', '942029405', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `razas`
--

CREATE TABLE `razas` (
  `raza_id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `especie_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `razas`
--

INSERT INTO `razas` (`raza_id`, `nombre`, `especie_id`) VALUES
(1, 'Labrador Retriever', 1),
(2, 'Bulldog', 1),
(3, 'Poodle', 1),
(4, 'Shitzu', 1),
(5, 'Persa', 2),
(6, 'Siamés', 2),
(7, 'Maine Coon', 2),
(8, 'Canario', 3),
(9, 'Periquito', 3),
(10, 'Iguana', 4),
(11, 'Tortuga', 4),
(12, 'Hamster Sirio', 5),
(13, 'Cobaya', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `signo_vital`
--

CREATE TABLE `signo_vital` (
  `signo_vital_id` bigint(20) NOT NULL,
  `valor` double DEFAULT NULL,
  `tipo_signo_vital_id` bigint(20) DEFAULT NULL,
  `visita_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_servicio`
--

CREATE TABLE `tipo_servicio` (
  `tiposervicio_id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_servicio`
--

INSERT INTO `tipo_servicio` (`tiposervicio_id`, `nombre`) VALUES
(1, 'Consulta General'),
(2, 'Vacunación'),
(3, 'Desparasitación'),
(4, 'Cirugía'),
(5, 'Control de Crecimiento'),
(6, 'Emergencia'),
(7, 'Estética'),
(8, 'Ducha');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_signo_vital`
--

CREATE TABLE `tipo_signo_vital` (
  `tipo_signo_vital_id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_visita`
--

CREATE TABLE `tipo_visita` (
  `tipo_visita_id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_visita`
--

INSERT INTO `tipo_visita` (`tipo_visita_id`, `nombre`) VALUES
(1, 'Vacunación'),
(2, 'Diagnóstico'),
(3, 'Seguimiento'),
(4, 'Alergias'),
(5, 'Cirugía'),
(6, 'Tratamiento');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `triaje`
--

CREATE TABLE `triaje` (
  `triaje_id` bigint(20) NOT NULL,
  `fecha_actualizacion` datetime(6) DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) NOT NULL,
  `frecuencia_respiratoria` int(11) NOT NULL,
  `observaciones` varchar(1000) DEFAULT NULL,
  `peso` double NOT NULL,
  `temperatura` double NOT NULL,
  `mascota_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `triaje`
--

INSERT INTO `triaje` (`triaje_id`, `fecha_actualizacion`, `fecha_registro`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `observaciones`, `peso`, `temperatura`, `mascota_id`) VALUES
(1, NULL, '2025-07-11 15:17:50.000000', 122, 22, 'sobrepeso', 6, 38, 1),
(4, '2025-07-16 20:31:25.000000', '2025-07-16 20:02:15.000000', 122, 22, 'Se encuentra muy mansito', 50, 40, 5),
(9, NULL, '2025-07-17 23:14:50.000000', 120, 20, 'Desparacitacion xx', 5, 38, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','ASISTENTE','VET') DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `estado`, `fecha_registro`, `password`, `rol`, `username`) VALUES
(1, 'ACTIVO', '2025-07-11 00:00:00.000000', '$2a$10$g9vwbY8bNTmZyU.bWWgUTeONXm/.WKaNuV3spKCzE/SVAIc56d3ui', 'ASISTENTE', 'isaac2'),
(2, 'ACTIVO', '2025-07-14 18:39:33.000000', '$2a$10$BW4HL.uLN9dpgQ/GhMVt5uvs2dDaOodV8/8RKMhw0.gosSsBUSR0.', 'VET', 'isaac3'),
(3, 'ACTIVO', '2025-07-15 11:39:41.000000', '$2a$10$zUUdepRxl6D/7MBr4yzLO.aroxqBDxHZv1UqiThb2pt74i/TieIuG', 'ADMIN', 'juanCarlos'),
(4, 'ACTIVO', '2025-07-15 14:21:13.000000', '$2a$10$Hhp2Pf52kIbahWaaKMmoxeWeNTYoVWVbU9J/PLmR1uYmRHc5P9JK2', 'ASISTENTE', 'isaac5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinario`
--

CREATE TABLE `veterinario` (
  `veterinario_id` bigint(20) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `dni` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `veterinario`
--

INSERT INTO `veterinario` (`veterinario_id`, `apellido`, `dni`, `nombre`) VALUES
(1, 'García Rodríguez', '45678912', 'Ana María'),
(2, 'López Torres', '78912345', 'Carlos Alberto'),
(3, 'Martínez Silva', '32165498', 'Patricia'),
(4, 'Sánchez Pérez', '65498732', 'Juan Diego'),
(5, 'Ramírez Castro', '91234567', 'María José');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visita`
--

CREATE TABLE `visita` (
  `visita_id` bigint(20) NOT NULL,
  `caso_clinico_id` bigint(20) NOT NULL,
  `tipo_visita_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visita`
--

INSERT INTO `visita` (`visita_id`, `caso_clinico_id`, `tipo_visita_id`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 3, 2),
(4, 4, 1),
(5, 4, 3),
(6, 1, 1),
(7, 3, 2),
(8, 2, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caso_clinico`
--
ALTER TABLE `caso_clinico`
  ADD PRIMARY KEY (`caso_clinico_id`),
  ADD KEY `FKq63r2089bb4vjc656uf7b1kyw` (`mascota_id`);

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`cita_id`),
  ADD KEY `FKr8ud0mqhwmamqlb3ifxssxyyc` (`cliente_id`),
  ADD KEY `FKjjr9rbirfalfxoq1rndrc8sqq` (`mascota_id`),
  ADD KEY `FKb91u0t4cuy07wkwqjtkgmmkye` (`tipo_servicio`),
  ADD KEY `FKpod5e68nvkvih2v45qkdf7bwc` (`veterinario_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`);

--
-- Indices de la tabla `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`especie_id`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`mascota_id`),
  ADD KEY `FK3xoqy3hy4smr6kkm9k1wvgy6i` (`cliente_id`),
  ADD KEY `FKnrw5tubiedn1hk8cysy8cs223` (`raza_id`);

--
-- Indices de la tabla `perfil_personal`
--
ALTER TABLE `perfil_personal`
  ADD PRIMARY KEY (`perfil_id`),
  ADD UNIQUE KEY `UK2dmpvih12ai7foa7qvrl73lrq` (`usuario_id`);

--
-- Indices de la tabla `razas`
--
ALTER TABLE `razas`
  ADD PRIMARY KEY (`raza_id`),
  ADD KEY `FKkj66gaa17xyjrbo91664l83uf` (`especie_id`);

--
-- Indices de la tabla `signo_vital`
--
ALTER TABLE `signo_vital`
  ADD PRIMARY KEY (`signo_vital_id`),
  ADD KEY `FKilooc4dpnx4nclwh7inr02g4j` (`tipo_signo_vital_id`),
  ADD KEY `FK4uiqrjmpvy6e0jt8evy0gpuad` (`visita_id`);

--
-- Indices de la tabla `tipo_servicio`
--
ALTER TABLE `tipo_servicio`
  ADD PRIMARY KEY (`tiposervicio_id`);

--
-- Indices de la tabla `tipo_signo_vital`
--
ALTER TABLE `tipo_signo_vital`
  ADD PRIMARY KEY (`tipo_signo_vital_id`);

--
-- Indices de la tabla `tipo_visita`
--
ALTER TABLE `tipo_visita`
  ADD PRIMARY KEY (`tipo_visita_id`);

--
-- Indices de la tabla `triaje`
--
ALTER TABLE `triaje`
  ADD PRIMARY KEY (`triaje_id`),
  ADD UNIQUE KEY `UK2f2rnimlxx7r08t1rrymy9s84` (`mascota_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKm2dvbwfge291euvmk6vkkocao` (`username`);

--
-- Indices de la tabla `veterinario`
--
ALTER TABLE `veterinario`
  ADD PRIMARY KEY (`veterinario_id`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`visita_id`),
  ADD KEY `FK1r2fhriftitkwxo3vh5gcgggh` (`caso_clinico_id`),
  ADD KEY `FKjuf4lxgqk3eyr6y30475yj033` (`tipo_visita_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caso_clinico`
--
ALTER TABLE `caso_clinico`
  MODIFY `caso_clinico_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `cita_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `especies`
--
ALTER TABLE `especies`
  MODIFY `especie_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `mascota_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `perfil_personal`
--
ALTER TABLE `perfil_personal`
  MODIFY `perfil_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `razas`
--
ALTER TABLE `razas`
  MODIFY `raza_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `signo_vital`
--
ALTER TABLE `signo_vital`
  MODIFY `signo_vital_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo_servicio`
--
ALTER TABLE `tipo_servicio`
  MODIFY `tiposervicio_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tipo_signo_vital`
--
ALTER TABLE `tipo_signo_vital`
  MODIFY `tipo_signo_vital_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tipo_visita`
--
ALTER TABLE `tipo_visita`
  MODIFY `tipo_visita_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `triaje`
--
ALTER TABLE `triaje`
  MODIFY `triaje_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `veterinario`
--
ALTER TABLE `veterinario`
  MODIFY `veterinario_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `visita`
--
ALTER TABLE `visita`
  MODIFY `visita_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `caso_clinico`
--
ALTER TABLE `caso_clinico`
  ADD CONSTRAINT `FKq63r2089bb4vjc656uf7b1kyw` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`mascota_id`);

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `FKb91u0t4cuy07wkwqjtkgmmkye` FOREIGN KEY (`tipo_servicio`) REFERENCES `tipo_servicio` (`tiposervicio_id`),
  ADD CONSTRAINT `FKjjr9rbirfalfxoq1rndrc8sqq` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`mascota_id`),
  ADD CONSTRAINT `FKpod5e68nvkvih2v45qkdf7bwc` FOREIGN KEY (`veterinario_id`) REFERENCES `veterinario` (`veterinario_id`),
  ADD CONSTRAINT `FKr8ud0mqhwmamqlb3ifxssxyyc` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`);

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `FK3xoqy3hy4smr6kkm9k1wvgy6i` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  ADD CONSTRAINT `FKnrw5tubiedn1hk8cysy8cs223` FOREIGN KEY (`raza_id`) REFERENCES `razas` (`raza_id`);

--
-- Filtros para la tabla `perfil_personal`
--
ALTER TABLE `perfil_personal`
  ADD CONSTRAINT `FKlx3pa5wxb9esu156t84bkegsv` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `razas`
--
ALTER TABLE `razas`
  ADD CONSTRAINT `FKkj66gaa17xyjrbo91664l83uf` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`especie_id`);

--
-- Filtros para la tabla `signo_vital`
--
ALTER TABLE `signo_vital`
  ADD CONSTRAINT `FK4uiqrjmpvy6e0jt8evy0gpuad` FOREIGN KEY (`visita_id`) REFERENCES `visita` (`visita_id`),
  ADD CONSTRAINT `FKilooc4dpnx4nclwh7inr02g4j` FOREIGN KEY (`tipo_signo_vital_id`) REFERENCES `tipo_signo_vital` (`tipo_signo_vital_id`);

--
-- Filtros para la tabla `triaje`
--
ALTER TABLE `triaje`
  ADD CONSTRAINT `FKgpmt93mg4lyy89u9lwvqnlass` FOREIGN KEY (`mascota_id`) REFERENCES `mascota` (`mascota_id`);

--
-- Filtros para la tabla `visita`
--
ALTER TABLE `visita`
  ADD CONSTRAINT `FK1r2fhriftitkwxo3vh5gcgggh` FOREIGN KEY (`caso_clinico_id`) REFERENCES `caso_clinico` (`caso_clinico_id`),
  ADD CONSTRAINT `FKjuf4lxgqk3eyr6y30475yj033` FOREIGN KEY (`tipo_visita_id`) REFERENCES `tipo_visita` (`tipo_visita_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
