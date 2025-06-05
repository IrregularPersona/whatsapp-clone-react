import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Tooltip from '@radix-ui/react-tooltip';

const RegisterForm = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [uuid, setUuid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const generateUUID = () => {
        const newUuid = uuidv4();
        setUuid(newUuid);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!displayName.trim()) {
            setError('Please enter a display name!');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email!');
            return;
        }

        if (!uuid) {
            setError('Please generate a UUID!');
            return;
        }

        console.log('Register attempt: ', { displayName, email, uuid, password });
    };

    return (
        <Tooltip.Provider>
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter your details to register
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Tooltip.Root delayDuration={100}>
                                    <Tooltip.Trigger asChild>
                                        <label
                                            htmlFor="displayName"
                                            className="block text-sm font-medium text-foreground cursor-pointer"
                                        >
                                            Display Name
                                        </label>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="z-50 rounded bg-black px-3 py-1.5 text-xs text-white shadow-md" sideOffset={5}>
                                            This is the name other users will see
                                            <Tooltip.Arrow className="fill-black" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    required
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    placeholder="Enter your display name"
                                />
                            </div>

                            <div>
                                <Tooltip.Root delayDuration={100}>
                                    <Tooltip.Trigger asChild>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-foreground cursor-pointer"
                                        >
                                            Email address
                                        </label>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="z-50 rounded bg-black px-3 py-1.5 text-xs text-white shadow-md" sideOffset={5}>
                                            We'll use this to purely to verify you are not a spam.
                                            <Tooltip.Arrow className="fill-black" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <Tooltip.Root delayDuration={100}>
                                    <Tooltip.Trigger asChild>
                                        <label
                                            htmlFor="uuid"
                                            className="block text-sm font-medium text-foreground cursor-pointer"
                                        >
                                            UUID
                                        </label>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="z-50 rounded bg-black px-3 py-1.5 text-xs text-white shadow-md" sideOffset={5}>
                                            Universally Unique Identifier for your account ID. You will constantly be using this, keep it safe!
                                            <Tooltip.Arrow className="fill-black" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                                <div className="flex gap-2">
                                    <input
                                        id="uuid"
                                        name="uuid"
                                        type="text"
                                        required
                                        value={uuid}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        placeholder="Click generate to create a UUID"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateUUID}
                                        className="mt-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </Tooltip.Provider>
    );
};

export default RegisterForm;