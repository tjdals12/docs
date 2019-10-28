import { FaStar } from 'react-icons/fa';

export const transmittalsByVendor = [
    {
        vendor: 'R-001',
        '접수': 100,
        '회신': 92,
        '지연': 3
    },
    {
        vendor: 'R-002',
        '접수': 76,
        '회신': 32,
        '지연': 21
    },
    {
        vendor: 'R-003',
        '접수': 91,
        '회신': 89,
        '지연': 1
    },
    {
        vendor: 'R-004',
        '접수': 27,
        '회신': 24,
        '지연': 3
    },
    {
        vendor: 'R-005',
        '접수': 76,
        '회신': 32,
        '지연': 21
    },
    {
        vendor: 'R-006',
        '접수': 55,
        '회신': 52,
        '지연': 0
    },
    {
        vendor: 'R-007',
        '접수': 101,
        '회신': 78,
        '지연': 10
    },
    {
        vendor: 'R-008',
        '접수': 91,
        '회신': 91,
        '지연': 0
    },
    {
        vendor: 'R-009',
        '접수': 80,
        '회신': 68,
        '지연': 4
    },
    {
        vendor: 'R-010',
        '접수': 63,
        '회신': 61,
        '지연': 0
    }
]

export const transmittalsByStatus = [
    {
        statusName: '전체',
        count: 67
    },
    {
        statusName: '접수',
        count: 4
    },
    {
        statusName: '내부 검토',
        count: 17
    },
    {
        statusName: '사업주 검토',
        count: 9
    },
    {
        statusName: '회신',
        count: 37
    },
]

export const vendors = {
    Mechnical: '18',
    Stationary: '41',
    Pipe: '63',
    Electrical: '13',
    Instrument: '8',
    Fighting: '5',
    HVAC: '2',
    Civil: '1',
    Architect: '2'
}