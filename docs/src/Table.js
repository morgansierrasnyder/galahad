// @flow

import React from 'react'
import { capitalize } from 'lodash'
import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down'
import MdKeyboardArrowUp from 'react-icons/lib/md/keyboard-arrow-up'

import Galahad from '../../src'

const icon = (order) => {
  const Icon = (order === 'ASC' ? MdKeyboardArrowUp : MdKeyboardArrowDown)

  return <Icon style={{ marginLeft: 3, marginTop: -3 }} />
}

const renderHeader = sortBy => ({ self }) => (
  <h6 style={!self.noSort ? { cursor: 'pointer' } : {}}>
    {capitalize(self.id)}
    {sortBy.id === self.id && !self.noSort ? icon(sortBy.order) : ''}
  </h6>
)

const simpleRender = render => ({ entity, self }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
    {render ? render({ entity, self }) : entity[self.id]}
  </div>
)

type State = {
  columnOrder: string[],
  sortBy: { id: string, order: 'ASC' | 'DESC' }
}

export default class Table extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    const { columns } = this.props

    this.state = {
      columnOrder: columns.map(c => c.id),
      sortBy: { id: columns[0].id, order: 'ASC' }
    }
  }

  handleColumnChange = (columnOrder) => {
    console.log('column change')
    this.setState({ columnOrder })
  }

  handleHeaderClick = (column) => {
    if (column.noSort) return

    const { sortBy } = this.state

    this.setState({ sortBy: { id: column.id, order: sortBy.id === column.id && sortBy.order === 'ASC' ? 'DESC' : 'ASC' } })
  }

  render() {
    const { data, columns } = this.props
    const { sortBy, columnOrder } = this.state

    const definitions = columns.map(column => ({
      ...column,
      id: column.id,
      renderHeader: renderHeader(sortBy),
      render: simpleRender(column.render),
      spanPercent: column.spanPercent,
      expanded: !!column.expanded
    }))

    const sortedData = data.sort((a, b) => (
      // eslint-disable-next-line no-bitwise
      ((a[sortBy.id] < b[sortBy.id] ^ sortBy.order === 'ASC') === 0 ? -1 : 1))
    )

    return (
      <Galahad
        tableData={sortedData}
        columns={definitions}
        selectedColumns={columnOrder}
        onColumnChange={this.handleColumnChange}
        onHeaderClick={this.handleHeaderClick}
      />
    )
  }
}
