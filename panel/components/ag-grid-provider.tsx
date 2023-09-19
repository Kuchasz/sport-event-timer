"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { Demodal } from "demodal";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

type Props = { children: React.ReactNode };

export const AgGridProvider = ({ children }: Props) => {
    return (
        <>
            <Demodal.Container />
            {children}
        </>
    );
};
