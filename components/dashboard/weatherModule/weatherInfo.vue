<template>
  <div
    class="weather-container"
    ref="weatherContainer"
    :class="{ 'weather-visible': isWeatherDataLoaded }"
  >
    <div class="temperature">
      <span class="temp-value" ref="tempValue">{{ displayedTemperature }}</span>
      <span class="temp-unit">°C</span>
    </div>
    <div class="weather-icon" v-if="weatherIcon">
      <component :is="weatherIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchWeatherApi } from "openmeteo";
import { ref, onMounted, computed, watch } from "vue";
import gsap from "gsap";
import {
	Sun,
	Cloud,
	CloudRain,
	CloudSnow,
	CloudLightning,
	Thermometer,
} from "lucide-vue-next";

interface WeatherData {
	current?: {
		time: Date;
		temperature2m: number | null;
	};
	hourly?: {
		time: Date[];
		temperature2m: Float32Array | null;
	};
}

const weatherData = ref<WeatherData>({});
const weatherContainer = ref<HTMLElement | null>(null);
const tempValue = ref<HTMLElement | null>(null);
const displayedTemperature = ref<string | number>("--");
const previousTemp = ref<number | null>(null);
const isWeatherDataLoaded = ref<boolean>(false);

const weatherIcon = computed(() => {
	const temp = weatherData.value?.current?.temperature2m;
	if (temp === null || temp === undefined) return Thermometer;

	if (temp >= 25) return Sun;
	if (temp >= 15) return Cloud;
	if (temp >= 5) return CloudRain;
	if (temp >= -5) return CloudSnow;
	return CloudLightning;
});

watch(
	() => weatherData.value?.current?.temperature2m,
	(newTemp) => {
		if (newTemp !== null && newTemp !== undefined) {
			const targetTemp = Math.round(newTemp);

			if (tempValue.value && previousTemp.value !== targetTemp) {
				gsap.to(displayedTemperature, {
					duration: 1.5,
					value: targetTemp,
					onUpdate: function () {
						displayedTemperature.value = Math.round(this.targets()[0].value);
					},
					ease: "power2.out",
				});

				previousTemp.value = targetTemp;
			} else {
				displayedTemperature.value = targetTemp;
				previousTemp.value = targetTemp;
			}
		}
	},
);

const animateWeatherDisplay = () => {
	if (!weatherContainer.value) return;

	isWeatherDataLoaded.value = true;

	const tempValueEl = weatherContainer.value.querySelector(".temp-value");
	const tempUnit = weatherContainer.value.querySelector(".temp-unit");
	const icon = weatherContainer.value.querySelector(".weather-icon");

	gsap.from(tempValueEl, {
		opacity: 0,
		x: -10,
		duration: 0.8,
		ease: "back.out",
	});

	gsap.from(tempUnit, {
		opacity: 0,
		x: -5,
		duration: 0.5,
		delay: 0.2,
		ease: "power1.out",
	});

	gsap.from(icon, {
		opacity: 0,
		scale: 0.5,
		duration: 0.7,
		delay: 0.3,
		ease: "elastic.out(1, 0.5)",
	});
};

const getLocationFromIP = async () => {
	try {
		const response = await fetch("https://ipapi.co/json/");
		const data = await response.json();
		return {
			latitude: data.latitude,
			longitude: data.longitude,
		};
	} catch (error) {
		console.error("Error fetching location from IP:", error);
		throw error;
	}
};

const fetchWeatherData = async () => {
	let latitude = 45.76342;
	let longitude = 4.834277;

	try {
		const location = await getLocationFromIP();
		latitude = location.latitude;
		longitude = location.longitude;
	} catch (error: unknown) {
		console.warn(
			`Using default location. Error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const params = {
		latitude,
		longitude,
		hourly: "temperature_2m",
		current: "temperature_2m",
		timezone: "Europe/Berlin",
	};
	const url = "https://api.open-meteo.com/v1/forecast";

	try {
		const responses = await fetchWeatherApi(url, params);

		const range = (start: number, stop: number, step: number) =>
			Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

		const response = responses[0];
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const current = response.current();
		const hourly = response.hourly();

		if (current && hourly) {
			weatherData.value = {
				current: {
					time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
					temperature2m: current.variables(0)?.value() ?? null,
				},
				hourly: {
					time: range(
						Number(hourly.time()),
						Number(hourly.timeEnd()),
						hourly.interval(),
					).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
					temperature2m: hourly.variables(0)?.valuesArray() ?? null,
				},
			};

			animateWeatherDisplay();
		}
	} catch (error) {
		console.error("Error fetching weather data:", error);
	}
};

onMounted(() => {
	fetchWeatherData();
});
</script>

<style scoped>
.weather-container {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: var(--color-black);
  min-width: 100px;
  justify-content: space-between;
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.weather-visible {
  opacity: 0.85;
  transform: translateY(0);
}

.temperature {
  display: flex;
  align-items: baseline;
}

.temp-value {
  font-size: 1.3rem;
  font-weight: 500;
  margin-right: 2px;
  transition: color 0.3s ease;
}

.temp-unit {
  font-size: 0.9rem;
  opacity: 0.7;
}

.weather-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  color: inherit;
  opacity: 0.8;
  transform: scale(0.85);
}

@keyframes temperature-pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.temp-loading {
  animation: temperature-pulse 1.5s infinite ease-in-out;
}
</style>
