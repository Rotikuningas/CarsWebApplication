import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';
import axios from 'axios';

export default function EditCarPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState<Car | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadCar() {
            try {
                if (!id) throw new Error('Brak ID samochodu');

                const data = await getCarById(id, controller.signal);
                setCar(data);
            } catch (caughtError) {
                if (axios.isCancel(caughtError)) {
                    return;
                }

                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                } else {
                    setError('Wystapil nieznany blad.');
                }
            }
        }

        loadCar();

        return () => controller.abort();
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!car) return;

        const { name, value } = e.target;

        setCar({
            ...car,
            [name]: name === 'brand' || name === 'model' || name === 'productionDate'
                ? value
                : Number(value)
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!car || !id) return;

        const updatedCar: NewCar = {
            brand: car.brand,
            model: car.model,
            doorsNumber: car.doorsNumber,
            luggageCapacity: car.luggageCapacity,
            engineCapacity: car.engineCapacity,
            fuelType: car.fuelType,
            productionDate: car.productionDate,
            averageFuelConsumption: car.averageFuelConsumption,
            bodyType: car.bodyType
        };

        try {
            await updateCar(id, updatedCar);
            navigate(`/cars/${id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Błąd aktualizacji');
        }
    }

    if (error) return <p>Błąd: {error}</p>;
    if (!car) return <p>Ładowanie samochodu...</p>;

    return (
        <div>
            <h1>Edytuj samochód</h1>

            <form onSubmit={handleSubmit}>
                <label>Marka:
                    <input name="brand" value={car.brand} onChange={handleChange} required />
                </label>

                <label>Model:
                    <input name="model" value={car.model} onChange={handleChange} required />
                </label>

                <label>Liczba drzwi:
                    <input type="number" name="doorsNumber" value={car.doorsNumber} onChange={handleChange} required />
                </label>

                <label>Pojemność bagażnika:
                    <input type="number" name="luggageCapacity" value={car.luggageCapacity} onChange={handleChange} required />
                </label>

                <label>Pojemność silnika:
                    <input type="number" name="engineCapacity" value={car.engineCapacity} onChange={handleChange} required />
                </label>

                <label>Rodzaj paliwa:
                    <input type="number" name="fuelType" value={car.fuelType} onChange={handleChange} required />
                </label>

                <label>Data produkcji:
                    <input type="date" name="productionDate" value={car.productionDate} onChange={handleChange} required />
                </label>

                <label>Średnie spalanie:
                    <input type="number" step="0.1" name="averageFuelConsumption" value={car.averageFuelConsumption} onChange={handleChange} required />
                </label>

                <label>Typ nadwozia:
                    <input type="number" name="bodyType" value={car.bodyType} onChange={handleChange} required />
                </label>

                <button type="submit">Zapisz zmiany</button>
            </form>
        </div>
    );
}
