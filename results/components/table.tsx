import classNames from "classnames";
import React, { Fragment, ReactNode } from "react";
import { Loader } from "./loader";

const tdClassName = "p-2 py-3";

type Item<T extends unknown> = React.ReactElement<{ item: T }>;

type TableProps<T> = {
    rows: T[];
    headers: string[];
    children: Item<T>[];
    getKey: (item: T) => string;
};

const HeaderCell = ({ children }: { children: string }) => (
    <div
        className={tdClassName + " border-b-2 border-orange-500 bg-zinc-100 font-semibold cursor-pointer sticky top-0"}
    >
        {children}
    </div>
);

const DataCell = ({ children, index }: { index: number; children: ReactNode }) => (
    <div className={classNames(tdClassName, index % 2 === 0 ? "bg-zinc-200" : "bg-zinc-100")}>{children}</div>
);

export const Table = <T extends {}>({ rows, headers, children, getKey }: TableProps<T>) => {
    if (!rows)
        return (
            <div className="flex font-semibold justify-center items-center">
                Smarujemy łańcuch...
                <Loader />
            </div>
        );

    const gridTemplateColumns = children.map((_) => "auto").join(" ");
    // "auto auto minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr) auto auto auto auto auto auto";

    return (
        <div className="grid flex-grow auto-rows-min text-sm bg-zinc-100" style={{ gridTemplateColumns }}>
            {headers.map((h) => (
                <HeaderCell key={h}>{h}</HeaderCell>
            ))}

            {rows.map((row, i) => {
                return (
                    <Fragment key={getKey(row) + i}>
                        {children.map((item, ii) => (
                            <DataCell key={getKey(row) + i + ii} index={i}>
                                {React.cloneElement(item, { ...item.props, item: row })}
                            </DataCell>
                        ))}
                    </Fragment>
                );
            })}
        </div>
    );
};

Table.Item = <T extends unknown>(props: { item?: T; render: (item: T) => JSX.Element }) =>
    props.item ? props.render(props.item) : null;
