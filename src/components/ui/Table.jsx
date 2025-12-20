import React from 'react';
import { clsx } from 'clsx';

export const Table = ({ headers, children, className }) => {
    return (
        <div className={clsx("w-full overflow-auto rounded-lg border", className)}>
            <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b bg-gray-50/50">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export const TableRow = ({ children, className, ...props }) => (
    <tr
        className={clsx("border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-muted", className)}
        {...props}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className, ...props }) => (
    <td
        className={clsx("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    >
        {children}
    </td>
);
