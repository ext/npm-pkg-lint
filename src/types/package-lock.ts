export interface PackageLock {
	lockfileVersion: number;
}

export interface PackageLockVersion3 extends PackageLock {
	lockfileVersion: 3;
	packages: Record<string, PackageLockPackage>;
}

export interface PackageLockPackage {
	resolved?: string;
	link?: boolean;
}
