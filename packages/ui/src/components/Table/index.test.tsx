import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Table } from './index';
import styles from './Table.module.scss';

type Invoice = {
  amount: number;
  id: string;
  status: string;
};

const invoices: Invoice[] = [
  {
    amount: 250,
    id: 'INV-001',
    status: 'Paid',
  },
  {
    amount: 512,
    id: 'INV-002',
    status: 'Open',
  },
];

describe('Table', () => {
  it('exposes compound members', () => {
    expect(Table.Container).toBeDefined();
    expect(Table.Caption).toBeDefined();
    expect(Table.Head).toBeDefined();
    expect(Table.Body).toBeDefined();
    expect(Table.Foot).toBeDefined();
    expect(Table.Row).toBeDefined();
    expect(Table.Header).toBeDefined();
    expect(Table.Data).toBeDefined();
    expect(Table.Cell).toBeDefined();
    expect(Table.Empty).toBeDefined();
  });

  it('renders semantic primitives in declarative composition mode', () => {
    render(
      <Table data-testid="table">
        <Table.Caption>Recent invoices</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByTestId('table')).toHaveProperty('tagName', 'TABLE');
    expect(screen.getByText('Recent invoices')).toHaveProperty(
      'tagName',
      'CAPTION'
    );
    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('cell')).toHaveLength(2);
  });

  it('uses data mode with accessor, render, and key fallback lookup', () => {
    render(
      <Table
        columns={[
          {
            key: 'invoice',
            accessor: 'id',
            header: 'Invoice',
          },
          {
            key: 'status',
            header: 'Status',
          },
          {
            key: 'amount',
            accessor: 'amount',
            align: 'right',
            header: 'Amount',
            render: (value) => `$${Number(value).toFixed(2)}`,
          },
        ]}
        data={invoices}
      />
    );

    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toBeInTheDocument();
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();

    const amountCell = screen.getByText('$250.00').closest('td');

    expect(amountCell).toHaveClass(styles.alignEnd);
  });

  it('prefers Table.Caption over caption prop when both are provided', () => {
    render(
      <Table caption="Caption prop">
        <Table.Caption>Caption child</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.Data>Only row</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByText('Caption child')).toBeInTheDocument();
    expect(screen.queryByText('Caption prop')).not.toBeInTheDocument();
  });

  it('renders Table.Empty with inferred colSpan from columns in data mode', () => {
    render(
      <Table
        columns={[
          { key: 'invoice', header: 'Invoice' },
          { key: 'status', header: 'Status' },
          { key: 'amount', header: 'Amount' },
        ]}
        data={[]}
        emptyState="No invoices"
      />
    );

    const emptyCell = screen.getByText('No invoices').closest('td');

    expect(emptyCell).toHaveAttribute('colspan', '3');
  });

  it('infers Table.Empty colSpan from first row in children mode', () => {
    render(
      <Table>
        <Table.Body>
          <tr>
            <td>INV-001</td>
            <td>$10.00</td>
          </tr>
          <Table.Empty title="Nothing else" />
        </Table.Body>
      </Table>
    );

    const emptyCell = screen.getByText('Nothing else').closest('td');

    expect(emptyCell).toHaveAttribute('colspan', '2');
  });

  it('falls back to colSpan=1 and warns in dev when Empty cannot infer columns', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Table>
        <Table.Body>
          <Table.Empty title="No rows" />
        </Table.Body>
      </Table>
    );

    const emptyCell = screen.getByText('No rows').closest('td');

    expect(emptyCell).toHaveAttribute('colspan', '1');
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('warns when Table.Container is focusable with scroll and no label', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Table.Container scroll="horizontal">
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Data>Cell</Table.Data>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Container>
    );

    const region = screen.getByRole('region', { name: 'Scrollable table' });

    expect(region).toHaveAttribute('tabindex', '0');
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('applies row selected, disabled, and interactive defaults', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Table>
        <Table.Body>
          <Table.Row onClick={onClick} selected>
            <Table.Data>Clickable row</Table.Data>
          </Table.Row>
          <Table.Row disabled onClick={onClick}>
            <Table.Data>Disabled row</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const clickableRow = screen.getByText('Clickable row').closest('tr');
    const disabledRow = screen.getByText('Disabled row').closest('tr');

    expect(clickableRow).toHaveAttribute('aria-selected', 'true');
    expect(clickableRow).toHaveAttribute('data-interactive');
    expect(disabledRow).toHaveAttribute('aria-disabled', 'true');

    await user.click(clickableRow as HTMLTableRowElement);
    await user.click(disabledRow as HTMLTableRowElement);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('normalizes align values and maps sortDirection to aria-sort', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header align="left" sortDirection="ascending">
              Invoice
            </Table.Header>
            <Table.Header align="right" sortDirection="descending">
              Amount
            </Table.Header>
          </Table.Row>
        </Table.Head>
      </Table>
    );

    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveClass(
      styles.alignStart
    );
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveClass(
      styles.alignEnd
    );
    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toHaveAttribute('aria-sort', 'ascending');
    expect(
      screen.getByRole('columnheader', { name: 'Amount' })
    ).toHaveAttribute('aria-sort', 'descending');
  });

  it('forwards refs to native elements and supports pass-through attributes', () => {
    const tableRef = createRef<HTMLTableElement>();
    const headerRef = createRef<HTMLTableCellElement>();
    const dataRef = createRef<HTMLTableCellElement>();

    render(
      <Table aria-label="Invoices" data-state="ready" ref={tableRef}>
        <Table.Head>
          <Table.Row>
            <Table.Header data-kind="header" ref={headerRef}>
              Invoice
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data data-kind="data" ref={dataRef}>
              INV-001
            </Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(tableRef.current).not.toBeNull();
    expect(headerRef.current).not.toBeNull();
    expect(dataRef.current).not.toBeNull();
    expect(screen.getByRole('table', { name: 'Invoices' })).toHaveAttribute(
      'data-state',
      'ready'
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'data-kind',
      'header'
    );
    expect(screen.getByRole('cell')).toHaveAttribute('data-kind', 'data');
  });

  it('renders scroll responsive wrapper for responsive="scroll"', () => {
    const { container } = render(
      <Table
        columns={[{ key: 'invoice', header: 'Invoice' }]}
        data={[{ invoice: 'INV-001' }]}
        responsive="scroll"
        responsiveBreakpoint="tablet"
      />
    );

    const wrapper = container.querySelector(`.${styles.responsiveScroll}`);

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass(styles.responsiveScrollTablet);
  });

  it('has no accessibility violations for representative semantic usage', async () => {
    const { container } = render(
      <Table caption="Recent invoices">
        <Table.Head>
          <Table.Row>
            <Table.Header scope="col">Invoice</Table.Header>
            <Table.Header align="end" scope="col">
              Amount
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
