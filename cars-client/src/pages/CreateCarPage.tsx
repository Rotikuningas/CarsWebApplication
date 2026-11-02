import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
    const navigate = useNavigate();

    const [car, setCar] = useState<NewCar>({
        brand: '',
        model: '',
        doorsNumber: 5,
        luggageCapacity: 400,
        engineCapacity: 1600,
        fuelType: 1,
        productionDate: '',
        averageFuelConsumption: 6,
        bodyType: 1
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;

        setCar(previous => ({
            ...previous,
            [name]: [
                'doorsNumber',
                'luggageCapacity',
                'engineCapacity',
                'fuelType',
                'averageFuelConsumption',
                'bodyType'
            ].includes(name) ? Number(value) : value
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const newCar = await createCar(car);
            navigate(`/cars/${newCar.id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Błąd zapisu');
        }
    }

    return (
        <div>
            <h1>Dodaj samochód</h1>

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

                <button type="submit">Zapisz samochód</button>
            </form>
        </div>
    );
}
